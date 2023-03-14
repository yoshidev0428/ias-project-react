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
from mainApi.app.images.sub_routers.tile.models import ExperimentModel
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app import main
from mainApi.config import STATIC_PATH
from bson.json_util import dumps
import pydantic
from pydantic import BaseModel
from datetime import datetime
from PIL import Image
import subprocess
from mainApi.app.images.utils.convert import get_metadata
import json


async def add_experiment(
    experiment_name: str,
    fileNames: List[str],
    clear_previous: bool,
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> ExperimentModel:
    tiles = [
        doc
        async for doc in db["experiment"].find(
            {"experiment_name": experiment_name, "user_id": current_user.id}
        )
    ]
    if len(tiles) > 0:
        return False

    experiment = ExperimentModel(
        user_id=PyObjectId(current_user.id),
        experiment_name=experiment_name,
        fileNames=fileNames,
    )
    await db["experiment"].insert_one(experiment.dict(exclude={"id"}))
    return True


async def add_experiment_with_folder(
    folderPath: str,
    experiment_name: str,
    folderName: str,
    files: List[UploadFile],
    clear_previous: bool,
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> ExperimentModel:
    print("This is experiment part", folderName, experiment_name, folderPath)
    print(files)
    setfiles = []
    for each_file_folder in files:
        file_name_folder = each_file_folder.filename
        setfiles.append(file_name_folder)
        file_path_folder = os.path.join(folderPath, file_name_folder)
        async with aiofiles.open(file_path_folder, "wb") as f:
            content_folder = await each_file_folder.read()
            await f.write(content_folder)
    experimentData = {
        "user_id": str(PyObjectId(current_user.id)),
        "experiment_name": experiment_name,
        "experiment_data": [{"folder_name": folderName, "files": setfiles}],
        "update_time": datetime.now(),
    }
    print("success")
    await db["experiment"].insert_one(experimentData)
    return True


async def add_experiment_with_folders(
    folderPath: str,
    experiment_name: str,
    files: List[UploadFile],
    paths: List[str],
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> ExperimentModel:
    index = 0
    folders = []
    files_in_folder = []
    edited_paths = paths.split(",")

    folderName = ""
    make_new_folder = ""
    if "/" not in edited_paths[0]:
        make_new_folder = folderPath
    else:
        if not edited_paths[0][0] == "/":
            edited_paths[0] = "/" + edited_paths[0]
        directory = edited_paths[0].split("/")
        directory_length = len(directory)
        make_new_folder = folderPath
        for i in range(directory_length - 2):
            make_new_folder = make_new_folder + "/" + directory[i + 1]
            folderName += "/" + directory[i + 1]
            if not os.path.exists(make_new_folder):
                os.makedirs(make_new_folder)

    for each_file_folder in files:
        index = index + 1
        fPath = ""
        fileName = ""
        if "/" in each_file_folder.filename:
            fPath = folderPath
            new_folder_path = folderPath + "/" + each_file_folder.filename
            fileName = each_file_folder.filename.split("/")[
                len(each_file_folder.filename.split("/")) - 1
            ]
            files_in_folder.append(fileName)
        else:
            fPath = make_new_folder
            fileName = each_file_folder.filename
            files_in_folder.append(fileName)
            new_folder_path = make_new_folder + "/" + each_file_folder.filename

        if index == len(files):
            folders.append({"folder": folderName, "files": files_in_folder})

        async with aiofiles.open(new_folder_path, "wb") as f:
            content_folder = await each_file_folder.read()
            await f.write(content_folder)

        imagedata = get_metadata(new_folder_path)
        metadata = {"metadata": json.dumps(imagedata), "file_name": fileName}
        await db["metadata"].insert_one(metadata)

        if each_file_folder.filename[-9:].lower() != ".ome.tiff":
            fileFormat = each_file_folder.filename.split(".")
            inputPath = os.path.abspath(new_folder_path)
            if fileFormat[-1].lower() == "png" or fileFormat[-1].lower() == "bmp":
                img = Image.open(inputPath)
                inputPath = os.path.abspath(
                    fPath + "/" + ".".join(fileFormat[0:-1]) + ".jpg"
                )
                img.save(inputPath, "JPEG")

            outputPath = os.path.abspath(
                fPath + "/" + ".".join(fileFormat[0:-1]) + ".ome.tiff"
            )
            cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '{inputPath}' '{outputPath}'".format(
                inputPath=inputPath, outputPath=outputPath
            )
            subprocess.run(cmd_str, shell=True)

    experimentData = {
        "user_id": str(PyObjectId(current_user.id)),
        "experiment_name": experiment_name,
        "experiment_data": folders,
        "update_time": datetime.now(),
    }
    oldExpData = await db["experiment"].find_one({"experiment_name": experiment_name})
    if oldExpData is None:
        await db["experiment"].insert_one(experimentData)
    else:
        merged_data = []
        folder_mapping = {}

        # Create a mapping of folder names to their corresponding experiment data
        for doc in [experimentData, oldExpData]:
            for folder_data in doc["experiment_data"]:
                folder = folder_data["folder"]
                if folder not in folder_mapping:
                    folder_mapping[folder] = []
                folder_mapping[folder].append(folder_data["files"])

        # Merge experiment data for matching folder names
        for folder, file_lists in folder_mapping.items():
            merged_files = []
            for files in file_lists:
                merged_files += files
            merged_data.append({"folder": folder, "files": list(set(merged_files))})

        await db["experiment"].update_one(
            {"_id": oldExpData["_id"]},
            {"$set": {"experiment_data": merged_data}},
        )

    return True


async def add_experiment_with_files(
    folderPath: str,
    experiment_name: str,
    files: List[UploadFile],
    clear_previous: bool,
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> ExperimentModel:
    print("This is experiment part", experiment_name, folderPath)
    print(files)
    setfiles = []
    for each_file_folder in files:
        file_name_folder = each_file_folder.filename
        setfiles.append(file_name_folder)
        file_path_folder = os.path.join(folderPath, file_name_folder)
        async with aiofiles.open(file_path_folder, "wb") as f:
            content_folder = await each_file_folder.read()
            await f.write(content_folder)
    experimentData = {
        "user_id": str(PyObjectId(current_user.id)),
        "experiment_name": experiment_name,
        "experiment_data": setfiles,
        "update_time": datetime.now(),
    }
    print("success")
    await db["experiment"].insert_one(experimentData)
    return True


# async def add_experiment_name(experiment_name: str,
# 						clear_previous: bool,
# 					    current_user: UserModelDB or ShowUserModel,
# 					    db: AsyncIOMotorDatabase) -> ExperimentModel:
# 	tiles = [doc async for doc in db['experiment'].find({'experiment_name': experiment_name, 'user_id': current_user.id})]
# 	if len(tiles) > 0:
# 		return False

# 	experiment = ExperimentModel(
# 		user_id=PyObjectId(current_user.id),
# 		experiment_name=experiment_name
# 	)
# 	await db['experiment'].insert_one(experiment.dict(exclude={'id'}))
# 	return True


async def get_experiment_data(
    experiment_name: str,
    user_id: str,
    clear_previous: bool,
    current_user: UserModelDB or ShowUserModel,
    db: AsyncIOMotorDatabase,
) -> List[str]:
    cursor = await db["experiment"].find_one(
        {"experiment_name": experiment_name, "user_id": user_id}
    )
    experiment = pydantic.parse_obj_as(ExperimentModel, cursor)

    if experiment is None:
        return False

    print(experiment)
    return experiment
