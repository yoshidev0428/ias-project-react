from pathlib import Path
from typing import List
import os
from fastapi import UploadFile
import aiofiles
from PIL import Image

from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.app.auth.models.user import UserModelDB, PyObjectId, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import FileModelDB
import subprocess

async def save_tiling_images(
    path: Path,
    files: List[UploadFile],
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> List[FileModelDB]:
    tiles: List[FileModelDB] = []
    filenames = []
    for each_file in files:
        file_name = each_file.filename
        content_type = each_file.content_type

        file_path = os.path.join(path, file_name)

        async with aiofiles.open(file_path, "wb") as f:
            content = await each_file.read()
            await f.write(content)

            if file_name[-9:].lower() != ".ome.tiff":
                fileFormat = file_name.split(".")
                inputPath = os.path.abspath(file_path)
                if fileFormat[-1].lower() == "png" or fileFormat[-1].lower() == "bmp":
                    img = Image.open(inputPath)
                    inputPath = os.path.abspath(
                        path + "/" + ".".join(fileFormat[0:-1]) + ".jpg"
                    )
                    img.save(inputPath, "JPEG")

                outputPath = os.path.abspath(
                    path + "/" + ".".join(fileFormat[0:-1]) + ".ome.tiff"
                )
                cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '{inputPath}' '{outputPath}'".format(
                    inputPath=inputPath, outputPath=outputPath
                )
                await asyncio.to_thread(subprocess.run, cmd_str, shell=True)

            filenames.append(file_name)

            tile = FileModelDB(
                user_id=PyObjectId(current_user.id),
                absolute_path=str(path),
                file_name=file_name,
                content_type=content_type,
                # width_px=width_px,
                # height_px=height_px
            )
            tiles.append(tile)

    print("add_image_tiles: filenames", filenames)
    await db["tile-image-cache"].insert_many([t.dict(exclude={"id"}) for t in tiles])
    return {"Flag_3d": True, "N_images": len(filenames), "images": filenames}
