from pathlib import Path
from typing import Any, List
import os
from bson import ObjectId
from fastapi import UploadFile
import aiofiles
from PIL import Image

from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.config import STATIC_PATH
from mainApi.app.auth.models.user import PyObjectId, UserModelDB, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import FileModelDB
from mainApi.config import CURRENT_STATIC
from .asyncio import shell


async def get_all_tiles(user: UserModelDB, db: AsyncIOMotorDatabase):
    tiles = []
    async for tile in db["tile-image-cache"].find({"user_id": user.id}, {"user_id": 0}):
        # Convert ObjectId fields to string values
        for key in tile.keys():
            if isinstance(tile[key], ObjectId):
                tile[key] = str(tile[key])
        tiles.append(tile)
    return tiles


async def add_image_tiles(
    path: Path,
    files: List[UploadFile],
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> List[FileModelDB]:
    new_tiles: List[FileModelDB] = []
    for each_file in files:
        file_name = each_file.filename
        file_path = os.path.join(path, file_name)
        pre = file_path.rsplit(".", 1)[0]

        async with aiofiles.open(file_path, "wb") as f:
            content = await each_file.read()
            await f.write(content)

        if file_name.endswith(("ome.tiff", "ome.tif", "tiff", "tif")):
            input = os.path.abspath(file_path)
            output = os.path.abspath(f"{pre}.png")

            # convert tiff image to png for thumbnail
            bf_cmd = f"sh /app/mainApi/bftools/bfconvert -separate -overwrite '{input}' '{output}'"
            await shell(bf_cmd)

            # save thumbnail image
            img = Image.open(output)
            img.thumbnail([100, 100])
            img.save(f"{pre}.timg", "png")

            # remove temp png image
            os.remove(output)
        else:
            img = Image.open(file_path)
            img.thumbnail([100, 100])
            img.save(f"{pre}.timg", "png")

        tile = {
            "user_id": current_user.id,
            "filename": file_name,
            "path": f"{CURRENT_STATIC}/{current_user.id}/images/{file_name}",
        }
        new_tiles.append(tile)
    # delete documents of same image path
    delete_res = await db["tile-image-cache"].delete_many(
        {"path": {"$in": [t.get("path") for t in new_tiles]}}
    )
    # insert new tile images
    insert_res = await db["tile-image-cache"].insert_many(new_tiles)
    inserted_ids = [str(id) for id in insert_res.inserted_ids]

    if delete_res.deleted_count == len(inserted_ids):
        return []
    return inserted_ids


async def delete_tiles_in(
    tile_ids: List[str],
    db: AsyncIOMotorDatabase,
) -> Any:
    tile_obj_ids = [PyObjectId(tile_id) for tile_id in tile_ids]
    async for tile in db["tile-image-cache"].find({"_id": {"$in": tile_obj_ids}}):
        pre = tile["filename"].rsplit(".", 1)[0]
        os.remove(os.path.abspath(os.path.join(STATIC_PATH, str(tile["user_id"]), 'images', tile["filename"])))
        os.remove(os.path.abspath(os.path.join(STATIC_PATH, str(tile["user_id"]), 'images', f'{pre}.timg')))
    res = await db["tile-image-cache"].delete_many({"_id": {"$in": tile_obj_ids}})
    return {"deleted_count": res.deleted_count}
