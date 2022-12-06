from pathlib import Path
from typing import List
import os
import datetime
from fastapi import UploadFile
import aiofiles
import PIL
import tifffile
from skimage import io
import numpy as np

from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.app.auth.models.user import UserModelDB, PyObjectId, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import NamePattenModel
from mainApi.app.images.sub_routers.tile.models import TileModelDB
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app import main
from mainApi.config import STATIC_PATH
from mainApi.app.images.utils.convert import convert_to_ome_format


async def save_upload_file(upload_file: UploadFile, destination: Path, chunk_size: int = 1024) -> None:
    async with aiofiles.open(destination, 'wb') as out_file:
        while content := await upload_file.read(chunk_size):  # async read chunk
            await out_file.write(content)  # async write chunk

async def add_image_tiles(path: Path,
                        files: List[UploadFile],
                        clear_previous: bool,
                        current_user: UserModelDB or ShowUserModel,
                        db: AsyncIOMotorDatabase) -> List[TileModelDB]:
    """
    Saves the uploaded tiles to the cache-storage folder/volume under the user_id of the current_user

    Front end should include a validator that checks if the file has already been uploaded and then reject it.
    No validation is done in the backend
    """
    
    tiles: List[TileModelDB] = []
    filenames = []
    for each_file in files:
        file_name = each_file.filename
        content_type = each_file.content_type

        file_path = os.path.join(path, file_name) 
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await each_file.read()
            await f.write(content)
            # convert to ome format
            file_name = convert_to_ome_format(path, file_name)
            file_path = os.path.join(path, file_name)

        if file_name != "":
            # print("add_image_tiles: ", path, file_name, content_type)
            filenames.append(file_name)
            width_px, height_px = PIL.Image.open(file_path).size
            tile = TileModelDB(
                user_id=PyObjectId(current_user.id),
                absolute_path=str(path),
                file_name=file_name,
                content_type=content_type,
                width_px=width_px,
                height_px=height_px
            )
            tiles.append(tile)
    
    print("add_image_tiles: filenames", filenames)
    await db['tile-image-cache'].insert_many([t.dict(exclude={'id'}) for t in tiles])
    return {"Flag_3d": True, "N_images": len(filenames), "images": filenames}
    # cache_path = STATIC_PATH
    # raw_source = io.imread(path, True)
    # res = raw_source
    # image_num = res.shape    
    # current_time = datetime.datetime.now() 
    # time_str = current_time.strftime("%Y%m%d_%H%M%S")
    # path_images = []
    # if image_num[2] > 3:
    #     for i in range(image_num[0]):
    #         path_image = os.path.join(cache_path, 'slice_{num:03d}'.format(num=i)+ '_' + time_str + '.png')
    #         io.imsave(path_image, normalize_2Dim_uint8(res[i]))
    #         path_image = path_image.split('/')[-1]
    #         path_images.append(path_image)
    #     D_flag = True
    #     return D_flag, image_num[0], path_images
    # else:
        # tiles: List[TileModelDB] = []
        # file = files[0]
        # path_image = os.path.join(cache_path, 'slice_000_'+ time_str +'.png')
        # io.imsave(path_image, normalize_2Dim_uint8(res))
        # path_image = path_image.split('/')[-1]
        # path_images.append(path_image)
        # width_px, height_px = PIL.Image.open(file.file).size
        # tile = TileModelDB(
        #     user_id=PyObjectId(current_user.id),
        #     absolute_path=str(path),
        #     file_name=file.filename,
        #     content_type=file.content_type,
        #     width_px=width_px,
        #     height_px=height_px
        # )
        # tiles.append(tile)
        # await db['tile-image-cache'].insert_many([t.dict(exclude={'id'}) for t in tiles])
        # path = tiles[0].absolute_path
        # D_flag = False
        # image_num = 1
        # return D_flag, image_num, path_images

def convol2D_processing(file_name):
    abs_path = STATIC_PATH
    file_path = str(abs_path) + "/" + str(file_name)
    img = PIL.Image.open(file_path)
    gray = img.convert('L')
    bw = gray.point(lambda x: 0 if x<128 else 255, '1')
    img = str(file_name).split(".")[0] + "_update.png"
    path = str(abs_path) + "/" + str(img)
    bw.save(path)
    return path

def normalize_2Dim_uint8(im):
    im = im.astype(np.float32)
    min = np.min(im)
    max = np.max(im)
    im = (im-min)/(max-min)*255
    return im.astype(np.uint8)