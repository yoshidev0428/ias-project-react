from pathlib import Path
from typing import List
import os
from fastapi import UploadFile
import aiofiles
from PIL import Image

from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.app.auth.models.user import UserModelDB, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import FileModelDB
from mainApi.config import CURRENT_STATIC
from .asyncio import shell


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
    await db["tile-image-cache"].delete_many(
        {"path": {"$in": [t.get("path") for t in new_tiles]}}
    )
    # insert new tile images
    await db["tile-image-cache"].insert_many(new_tiles)

    # return all tile images as response
    all_tiles = [
        doc
        async for doc in db["tile-image-cache"].find(
            {"user_id": current_user.id}, {"_id": 0, "user_id": 0}
        )
    ]
    return all_tiles
