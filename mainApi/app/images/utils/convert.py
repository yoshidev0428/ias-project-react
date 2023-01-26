import os
import javabridge
import bioformats
from bioformats import logback
import xml.etree.ElementTree as ET


javabridge.start_vm(class_path=bioformats.JARS,
                    run_headless=True)

def convert_to_ome_format(path, image_name):
    # javabridge.start_vm(class_path=bioformats.JARS,
    #                     run_headless=True)
    logback.basic_config()

    image_path = os.path.join(path, image_name) 
    if os.path.exists(image_path):
        image, scale = bioformats.load_image(image_path, rescale=False, wants_max_intensity=True)
        #print(image.shape)
        #omexml_metadata = bioformats.get_omexml_metadata(image_path)
        #print(omexml_metadata)
        pos = image_name.find(".TIF")
        if pos >= 0:
            os.remove(image_path)
            new_image_name = image_name[0:pos] + ".OME.TIF"
            new_image_path = os.path.join(path, new_image_name)
            bioformats.formatwriter.write_image(new_image_path, image, "uint16")
            javabridge.kill_vm()
            #print("convert_to_ome_format: ", image_path, new_image_path)
            return new_image_name
        # javabridge.kill_vm()
        return image_name
    # javabridge.kill_vm()
    return ""

def get_metadata(image_path):
    javabridge.start_vm(class_path=bioformats.JARS,
                        run_headless=True)
    logback.basic_config()

    omexml_metadata = bioformats.get_omexml_metadata(image_path)
    javabridge.kill_vm()
    #print(omexml_metadata)
    xmlroot = ET.fromstring(omexml_metadata)
    for x in xmlroot[0]:
        if 'Pixels' in x.tag:
            metadata = x.attrib
            print(metadata)
            return metadata
    return ""


def write_image(pathname, pixels, pixel_type,
                c = 0, z = 0, t = 0,
                size_c = 1, size_z = 1, size_t = 1,
                channel_names = None):
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
            ome.OM_SAMPLES_PER_PIXEL, str(pixels.shape[2]))
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
    jutil.run_script(script,
                     dict(path=pathname,
                          xml=xml,
                          index=index,
                          buffer=pixel_buffer))

def convert_pixels_to_buffer(pixels, pixel_type):
    '''Convert the pixels in the image into a buffer of the right pixel type

    pixels - a 2d monochrome or color image

    pixel_type - one of the OME pixel types

    returns a 1-d byte array
    '''
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

