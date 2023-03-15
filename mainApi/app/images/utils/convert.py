import os
import javabridge
import bioformats
from bioformats import logback
import xml.etree.ElementTree as ET
import numpy as np
import tempfile
import unittest
import bioformats.formatwriter as W
from bioformats.formatreader import load_using_bioformats, get_omexml_metadata
import bioformats.omexml as OME
import subprocess


class TestFormatWriter(unittest.TestCase):
    path = "mainApi/tests/test_image_convert/temp"
    files = []
    # imgPath = 'mainApi/tests/test_image_convert/LotA_pointA.JPG'
    imgPath = "mainApi/tests/test_image_convert/LotA_pointA_greyscale.JPG"
    # def get_tempfilename(self, suffix):
    #     fd, name = tempfile.mkstemp(suffix, self.path)
    #     self.files.append(name)
    #     os.close(fd)
    #     return name

    def setUp(self):
        javabridge.start_vm(class_path=bioformats.JARS, run_headless=True)

    def tearDown(self):
        javabridge.kill_vm()
        for filename in self.files:
            try:
                os.remove(filename)
            except:
                continue
        # os.rmdir(self.path)

    def test_01_01_write_monochrome_8_bit_tif(self):
        r = np.random.RandomState()
        r.seed(101)
        # img = r.randint(0, 256, (11, 33)).astype(np.uint8)
        img, _ = bioformats.load_image(
            self.imgPath, rescale=False, wants_max_intensity=True
        )
        # path = self.get_tempfilename(".ome.tif")
        if not os.path.isdir(self.path):
            os.makedirs(self.path)
        path = self.path + "/" + "result.ome.tif"
        if os.path.isfile(path):
            os.remove(path)

        W.write_image(path, img, OME.PT_UINT8)
        # result = load_using_bioformats(path, rescale=False)
        return path


def convert_to_ome_format(imgFullPath):
    logback.basic_config()
    image_path = os.path.join(imgFullPath)
    testObject = TestFormatWriter()
    path = testObject.test_01_01_write_monochrome_8_bit_tif()

    return path


def get_metadata(image_path):
    logback.basic_config()
    omexml_metadata = bioformats.get_omexml_metadata(image_path)
    print("omexml_mmetadata--------->", omexml_metadata)

    acquisitionDate = ''

    cmd_str = "sh /app/mainApi/bftools/showinf -omexml-only -nopix '" + image_path + "'"
    xml = subprocess.run(cmd_str, shell=True, capture_output=True)
    xmlroot = ET.fromstring(xml.stdout)

    for x in xmlroot:
        if 'Image' in x.tag:
            for y in x:
                if 'AcquisitionDate' in y.tag:
                    acquisitionDate = y.text

    print("acquisitiondate:", acquisitionDate)

    # rdr = javabridge.JClassWrapper('loci.formats.in.LeicaSCNReader')()
    # rdr.setOriginalMetadataPopulated(True)
    # rdr.setFlattenedResolutions(False)
    # rdr.setId(image_path)
    # print("Series Count", rdr.getSeriesCount())
    # print("Image Count", rdr.getImageCount())
    # print("Res Count", rdr.getResolutionCount())
    # rdr.setResolution(2)
    # javabridge.kill_vm()
    # print(omexml_metadata)
    xmlroot = ET.fromstring(omexml_metadata)
    plate_data = {}
    channels = []
    planes = []
    stage = {}
    microscope = {}
    objective = []
    for x in xmlroot:
        if "Instrument" in x.tag:
            for y in x:
                if "Microscope" in y.tag:
                    microscope = y.attrib
                if "Objective" in y.tag:
                    objective.append(y.attrib)
        if "Plate" in x.tag:
            plate_data = x.attrib
        if "Image" in x.tag:
            for y in x:
                if "StageLabel" in y.tag:
                    stage = y.attrib
                if "Pixels" in y.tag:
                    metadata = y.attrib
                    metadata["acquisitionDate"] = acquisitionDate
                    print('pixel data', metadata)
                    for z in y:
                        if "Channel" in z.tag:
                            channels.append(z.attrib)
                        if "Plane" in z.tag:
                            planes.append(z.attrib)
                    return {
                        "objective": objective,
                        "microscope": microscope,
                        "metadata": metadata,
                        "channels": channels,
                        "planes": planes,
                        "stage": stage,
                        "plates": plate_data,
                    }
            break

def write_image(
    pathname,
    pixels,
    pixel_type,
    c=0,
    z=0,
    t=0,
    size_c=1,
    size_z=1,
    size_t=1,
    channel_names=None,
):
    """Write the image using bioformats.

    :param filename: save to this filename

    :param pixels: the image to save

    :param pixel_type: save using this pixel type

    :param c: the image's channel index

    :param z: the image's `z` index

    :param t: the image's `t` index

    :param size_c: # of channels in the stack

    :param size_z: # of z stacks

    :param size_t: # of timepoints in the stack

    :param channel_names: names of the channels (make up names if not present).

    """
    omexml = ome.OMEXML()
    omexml.image(0).Name = os.path.split(pathname)[1]
    p = omexml.image(0).Pixels
    assert isinstance(p, ome.OMEXML.Pixels)
    p.SizeX = pixels.shape[1]
    p.SizeY = pixels.shape[0]
    p.SizeC = size_c
    p.SizeT = size_t
    p.SizeZ = size_z
    p.DimensionOrder = ome.DO_XYCZT
    p.PixelType = pixel_type
    index = c + size_c * z + size_c * size_z * t
    if pixels.ndim == 3:
        p.SizeC = pixels.shape[2]
        p.Channel(0).SamplesPerPixel = pixels.shape[2]
        omexml.structured_annotations.add_original_metadata(
            ome.OM_SAMPLES_PER_PIXEL, str(pixels.shape[2])
        )
    elif size_c > 1:
        p.channel_count = size_c

    pixel_buffer = convert_pixels_to_buffer(pixels, pixel_type)
    xml = omexml.to_xml()
    script = """
    importClass(Packages.loci.formats.services.OMEXMLService,
                Packages.loci.common.services.ServiceFactory,
                Packages.loci.formats.ImageWriter);
    var service = new ServiceFactory().getInstance(OMEXMLService);
    var metadata = service.createOMEXMLMetadata(xml);
    var writer = new ImageWriter();
    writer.setMetadataRetrieve(metadata);
    writer.setId(path);
    writer.setInterleaved(true);
    writer.saveBytes(index, buffer);
    writer.close();
    """
    jutil.run_script(
        script, dict(path=pathname, xml=xml, index=index, buffer=pixel_buffer)
    )


def convert_pixels_to_buffer(pixels, pixel_type):
    """Convert the pixels in the image into a buffer of the right pixel type

    pixels - a 2d monochrome or color image

    pixel_type - one of the OME pixel types

    returns a 1-d byte array
    """
    if pixel_type in (ome.PT_UINT8, ome.PT_INT8, ome.PT_BIT):
        as_dtype = np.uint8
    elif pixel_type in (ome.PT_UINT16, ome.PT_INT16):
        as_dtype = "<u2"
    elif pixel_type in (ome.PT_UINT32, ome.PT_INT32):
        as_dtype = "<u4"
    elif pixel_type == ome.PT_FLOAT:
        as_dtype = "<f4"
    elif pixel_type == ome.PT_DOUBLE:
        as_dtype = "<f8"
    else:
        raise NotImplementedError("Unsupported pixel type: %d" % pixel_type)
    buf = np.frombuffer(np.ascontiguousarray(pixels, as_dtype).data, np.uint8)
    env = jutil.get_env()
    return env.make_byte_array(buf)
