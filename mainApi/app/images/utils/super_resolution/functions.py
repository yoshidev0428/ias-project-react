import os
import os.path
from skimage import io
from pathlib import Path

from mainApi.app.images.utils.super_resolution.model.edsr import edsr
from mainApi.app.images.utils.super_resolution.model.srgan import generator
from mainApi.app.images.utils.super_resolution.model.wdsr import wdsr_b

from mainApi.app.images.utils.super_resolution.model.common import resolve_single
from mainApi.app.images.utils.super_resolution.utils import load_image 
from mainApi.config import STATIC_PATH

# Enhanced Deep Residual Networks for Single Image Super-Resolution (EDSR)
def EDSuperResolution(filepath: str, scale=4, depth=16):
    # Location of model weights
    weights_dir = Path(os.path.join(os.path.dirname(__file__), f'weights/edsr-{depth}-x{scale}'))
    weights_file = os.path.join(weights_dir, 'weights.h5')

    model = edsr(scale=scale, num_res_blocks=depth)
    model.load_weights(weights_file)
   
    lr = load_image(filepath)
    sr = resolve_single(model, lr)

    out_filename = filepath.split("/")[-1].split(".")[0] + "_edsr.tiff"
    out_path = os.path.join(filepath.rsplit("/", 1)[0], out_filename)

    io.imsave(out_path, sr)

    return out_path

# Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network (SRGAN)
def SRGAN(file_name):
    
    weights_dir = Path(os.path.join(os.path.dirname(__file__), f'weights/srgan'))
    weights_file = os.path.join(weights_dir, 'gan_generator.h5')

    gan_generator = generator()
    gan_generator.load_weights(weights_file)
    
    abs_path = STATIC_PATH
    file_path = str(abs_path) + "/" + str(file_name)
    
    lr = load_image(file_path)

    gan_sr = resolve_single(gan_generator, lr) 

    outFileName = str(file_name).split(".")[0] + "_GANSR.png"
    output_path = str(abs_path) + "/" + str(outFileName)
    
    io.imsave(output_path, gan_sr)
    return output_path
    
# Wide Activation for Efficient and Accurate Image Super-Resolution (WDSR)
def WDSR(file_name):

    # Number of residual blocks
    depth = 32

    # Super-resolution factor
    scale = 4

    weights_dir = Path(os.path.join(os.path.dirname(__file__), f'weights/wdsr-b-{depth}-x{scale}'))
    weights_file = os.path.join(weights_dir, 'weights.h5')

    model = wdsr_b(scale=scale, num_res_blocks=depth)
    model.load_weights(weights_file)

    abs_path = STATIC_PATH
    file_path = str(abs_path) + "/" + str(file_name)
    
    lr = load_image(file_path)
    wdsr = resolve_single(model, lr)

    outFileName = str(file_name).split(".")[0] + "_WDSR.png"
    output_path = str(abs_path) + "/" + str(outFileName)
    
    io.imsave(output_path, wdsr)
    return output_path
