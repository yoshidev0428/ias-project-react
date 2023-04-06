from pathlib import Path
from typing import List
import os
import datetime
from fastapi import UploadFile
import aiofiles
import PIL
from PIL import Image
import tifffile
from skimage import io
import numpy as np

from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.app.auth.models.user import UserModelDB, PyObjectId, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import NamePattenModel
from mainApi.app.images.sub_routers.tile.models import TileModelDB
from mainApi.app.images.sub_routers.tile.models import FileModelDB
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app import main
from mainApi.config import STATIC_PATH
from mainApi.app.images.utils.convert import convert_to_ome_format
from .asyncio import shell


async def save_upload_file(upload_file: UploadFile, destination: Path, chunk_size: int = 1024) -> None:
    async with aiofiles.open(destination, 'wb') as out_file:
        while content := await upload_file.read(chunk_size):  # async read chunk
            await out_file.write(content)  # async write chunk

async def add_image_tiles(path: Path,
                        files: List[UploadFile],
                        current_user: UserModelDB or ShowUserModel,
                        db: AsyncIOMotorDatabase) -> List[FileModelDB]:
    """
    Saves the uploaded tiles to the cache-storage folder/volume under the user_id of the current_user

    Front end should include a validator that checks if the file has already been uploaded and then reject it.
    No validation is done in the backend
    """
    tiles: List[FileModelDB] = []
    for each_file in files:
        file_name = each_file.filename
        file_path = os.path.join(path, file_name) 
        pre = file_path.rsplit('.', 1)[0]
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await each_file.read()
            await f.write(content)
        
        if file_name.endswith(('ome.tiff', 'ome.tif', 'tiff', 'tif')):
            input = os.path.abspath(file_path)
            output = os.path.abspath(f'{pre}.png')
            
            # convert tiff image to png for thumbnail
            bf_cmd = f"sh /app/mainApi/bftools/bfconvert -separate -overwrite '{input}' '{output}'"
            await shell(bf_cmd)

            # save thumbnail image 
            img = Image.open(output)
            img.thumbnail([100, 100])
            img.save(f'{pre}.timg')

            # remove temp png image
            os.remove(output)
        else:
            img = Image.open(file_path)
            img.thumbnail([100, 100])
            img.save(f'{pre}.timg')
            
        tile = FileModelDB(
            user_id=PyObjectId(current_user.id),
            filename=file_name,
        )
        tiles.append(tile)
    
    await db['tile-image-cache'].insert_many([t.dict(exclude={'id'}) for t in tiles])
 
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