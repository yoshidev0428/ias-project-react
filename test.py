import bioformats
import os
import javabridge
from bioformats import logback
import xml.etree.ElementTree as ET


javabridge.start_vm(class_path=bioformats.JARS,
                    run_headless=True)

image_path = "007007000.flex"
reader = bioformats.ImageReader(image_path)
info = reader.rdr
height = info.getSizeX()
width = info.getSizeY()

# omeMeta = bioformats.metadatatools.createOMEXMLMetadata()
# reader.setMetadataStore(omeMeta)
# reader.setId(image_path)
omexml_metadata = bioformats.get_omexml_metadata(image_path)
# print("xml file is ", omexml_metadata)

xmlroot = ET.fromstring(omexml_metadata)
print(xmlroot)
for x in xmlroot:
    print('tag val', x.tag)
    if 'StructuredAnnotations' in x.tag:
        print('structured----', x.attrib)
    if 'Plate' in x.tag:
        print('plate data', x.attrib)        
    if 'Image' in x.tag:
        # metadata = x.attrib
        # print('image data', metadata)
        print('subdata', x[0])
        for y in x:
            if 'Pixels' in y.tag :
                metadata = y.attrib
                print('pixel data', metadata)
                channel = []
                plane = []
                for z in y:
                    if 'Channel' in z.tag:
                        channel.append(z.attrib)
                    if 'Plane' in z.tag:
                        plane.append(z.attrib)
                print ('channel data', channel) 
                print ('plane data', plane)
                        
        break
# print("widths and height---", height, width)


