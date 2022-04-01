import numpy as np
from skimage import exposure, io
from scipy import ndimage, signal
from flowdec import data as fd_data
from flowdec import psf as fd_psf
from flowdec import restoration as fd_restoration
from scipy.signal import fftconvolve
from skimage import color as sk_color
from skimage import data as sk_data
from skimage.util import crop
import os
import os.path as osp
from mainApi.config import STATIC_PATH
import histomicstk as htk
# Deconvolution 3D
def RechardDeconvolution3d(file_name, effectiveness, isroi, dictRoiPts, gamma=0.2):
    fName, ext= '', ''
    for f in os.listdir(STATIC_PATH):
        if osp.splitext(f)[-1].lower() == '.tif' or osp.splitext(f)[-1].lower() == '.tiff':
            fName = f
            break
    if fName == '':
        fName = file_name
    ext = osp.splitext(fName)[-1].lower()
    data_path = osp.join(STATIC_PATH, fName)            
    originImg = io.imread(data_path)

    startX = round(dictRoiPts['startX'])
    startY = round(dictRoiPts['startY'])
    endX = round(dictRoiPts['endX'])
    endY = round(dictRoiPts['endY'])
    # crop image
    if isroi:
        actual = originImg[:, startY:endY, startX:endX]
    else:
        actual = originImg
    # Create a gaussian kernel that will be used to blur the original acquisition
    kernel = np.zeros_like(actual)
    for offset in [0, 1]:
        kernel[tuple((np.array(kernel.shape) - offset) // 2)] = 1
    kernel = ndimage.gaussian_filter(kernel, sigma=1.)

    # Run the deconvolution process and note that deconvolution initialization is best kept separate from 
    # execution since the "initialize" operation corresponds to creating a TensorFlow graph, which is a 
    # relatively expensive operation and should not be repeated across multiple executions
    algo = fd_restoration.RichardsonLucyDeconvolver(actual.ndim).initialize()
    res = algo.run(fd_data.Acquisition(data=actual, kernel=kernel), niter=effectiveness).data
    outFileName = str(fName).split(".")[0] + "_deconvol3d" + ext
    output_path = str(STATIC_PATH) + "/" + str(outFileName)
    
    if isroi:
        originImg[:, startY:endY, startX:endX] = res
        outImage = originImg
    else:
        outImage = res
    
    for f in os.listdir(STATIC_PATH):
        os.remove(os.path.join(STATIC_PATH, f))
    io.imsave(output_path, outImage)
    return output_path

# Deconvolution 2D
def RechardDeconvolution2d(file_name, effectiveness, isroi, dictRoiPts):

    ext = osp.splitext(file_name)[-1].lower()
    data_path = osp.join(STATIC_PATH, file_name) 
    originImg = io.imread(data_path)

    startX = round(dictRoiPts['startX'])
    startY = round(dictRoiPts['startY'])
    endX = round(dictRoiPts['endX'])
    endY = round(dictRoiPts['endY'])

    if isroi:
        img = originImg[startY:endY, startX:endX]
    else:
        img = originImg
    
    img = sk_color.rgb2gray(img)

    outFileName = str(file_name).split(".")[0] + "_deconvol2d" + ext    
    output_path = str(STATIC_PATH) + "/" + str(outFileName)
    psf = np.ones((5, 5)) / 25
           
    # Wrap image and PSF in "Acqusition" instance, which aids in doing comparisons and running
    # operations on all data associated with a data acquisition
    acquisition = fd_data.Acquisition(data=img, kernel=psf)

    # Run deconvolution using default arguments (will default to adding no padding to image
    # as its dimensions are already powers of 2)
    img_decon = fd_restoration.richardson_lucy(acquisition, niter=effectiveness)

    if isroi:        
        originImg[startY:endY, startX:endX] = sk_color.gray2rgb(img_decon)
        deconved_img = originImg
    else:
        deconved_img = img_decon 

    for f in os.listdir(STATIC_PATH):
        os.remove(os.path.join(STATIC_PATH, f))
    io.imsave(output_path, deconved_img)

    return output_path

# Deconvolution 2D using Supervised Color Deconv
def SupervisedColorDeconvolution(file_name, effectiveness, isroi, dictRoiPts):

    ext = osp.splitext(file_name)[-1].lower()
    data_path = osp.join(STATIC_PATH, file_name)
    imInput = io.imread(data_path)[:, :, :3]

    startX = round(dictRoiPts['startX'])
    startY = round(dictRoiPts['startY'])
    endX = round(dictRoiPts['endX'])
    endY = round(dictRoiPts['endY'])
    
    if isroi:
        img = imInput[startY:endY, startX:endX]
    else:
        img = imInput
    stain_color_map = htk.preprocessing.color_deconvolution.stain_color_map
    stains = ['hematoxylin',  # nuclei stain
          'eosin',        # cytoplasm stain
          'null']         # set to null if input contains only two stains
    W = np.array([stain_color_map[st] for st in stains]).T

    imDeconvolved = htk.preprocessing.color_deconvolution.color_deconvolution(img, W).Stains[:, :, 1]

    outFileName = str(file_name).split(".")[0] + "_deconvol2d" + ext    
    output_path = str(STATIC_PATH) + "/" + str(outFileName)

    if isroi:        
        imInput[startY:endY, startX:endX] = sk_color.gray2rgb(imDeconvolved)
        deconved_img = imInput
    else:
        deconved_img = imDeconvolved 

    for f in os.listdir(STATIC_PATH):
        os.remove(os.path.join(STATIC_PATH, f))
    io.imsave(output_path, deconved_img)

    return output_path