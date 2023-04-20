from typing import List
import os
import datetime
from fastapi import UploadFile
import aiofiles
import numpy as np
from motor.motor_asyncio import AsyncIOMotorDatabase
from mainApi.app.auth.models.user import UserModelDB, PyObjectId, ShowUserModel
from mainApi.app.images.sub_routers.tile.models import ExperimentModel
from mainApi.app.images.sub_routers.tile.models import UserCustomModel
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
import pydantic
from datetime import datetime
from PIL import Image
import subprocess
from mainApi.app.images.utils.convert import get_metadata
from cellpose import plot, utils
from .asyncio import shell


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
    tiling: bool = False
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
        folder = ""
        filename = ""
        if "/" in each_file_folder.filename:
            folder = folderPath
            new_folder_path = folderPath + "/" + each_file_folder.filename
            filename = each_file_folder.filename.split("/")[
                len(each_file_folder.filename.split("/")) - 1
            ]
            files_in_folder.append(filename)
        else:
            folder = make_new_folder
            filename = each_file_folder.filename
            files_in_folder.append(filename)
            new_folder_path = make_new_folder + "/" + each_file_folder.filename

        if index == len(files):
            # save tiling flag
            folders.append({"folder": folderName, "files": files_in_folder, "tiling": tiling})

        async with aiofiles.open(new_folder_path, "wb") as f:
            content_folder = await each_file_folder.read()
            await f.write(content_folder)

            if not each_file_folder.filename.endswith((".ome.tiff", ".ome.tif")):
                pre = each_file_folder.filename.rsplit('.', 1)[0]
                input = os.path.abspath(new_folder_path)

                input_pre = os.path.splitext(input)[0]

                if input.lower().endswith((".tiff", ".tif")):
                    output = os.path.abspath(f'{folder}/{pre}.png')
                    bfconv_cmd = f"sh /app/mainApi/bftools/bfconvert -overwrite '{input}' '{output}'"
                    await shell(bfconv_cmd)
                    input = output

                # save thumbnail image for tiling layout and previewing images
                try:
                    img = Image.open(input)
                    img.thumbnail([100, 100])
                    img.save(input_pre + '.timg', 'png')
                except:
                    pass

                output = os.path.abspath(f'{folder}/{pre}.ome.tiff')
                bfconv_cmd = f"sh /app/mainApi/bftools/bfconvert -separate -overwrite '{input}' '{output}'"
                await shell(bfconv_cmd)

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
            # save tiling flag when merging folder images too
            merged_data.append({"folder": folder, "files": list(set(merged_files)), "tiling": tiling})

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

async def convert_npy_to_jpg(file_full_path: str,
                             file_name: str,
                             model_info: object,
                             clear_previous: bool,
                             current_user: UserModelDB or ShowUserModel) -> ExperimentModel:


    file_full_name = file_full_path + file_name + "_seg.npy"
    fname = file_full_name

    dat = np.load(fname, allow_pickle=True).item()
    masks = dat['masks']
    flows = dat['flows'][0][0]
    img0 = dat['img'].copy()

    if img0.shape[0] < 4:
        img0 = np.transpose(img0, (1,2,0))
    if img0.shape[-1] < 3 or img0.ndim < 3:
        img0 = plot.image_to_rgb(img0)
    else:
        if img0.max()<=50.0:
            img0 = np.uint8(np.clip(img0*255, 0, 1))
    outlines = utils.outlines_list(dat['masks'])
    with open(file_full_path + file_name + '_cp_outlines.txt', 'w') as f:
        for o in outlines:
            xy = list(o.flatten())
            xy_str = ','.join(map(str, xy))
            f.write(xy_str)
            f.write('\n')
    print('num_rois', len(outlines))
    outlines = utils.masks_to_outlines(masks)
    overlay = plot.mask_overlay(img0, masks)
    outX, outY = np.nonzero(outlines)
    imgout= img0.copy()
    imgout[outX, outY] = np.array([255,0,0]) # pure red
    im = Image.fromarray(overlay, 'RGB')
    rgb_im = im.convert('RGB')
    rgb_im.save(file_full_path + file_name + '_mask.jpg', 'JPEG')
    #check the selected model is suitable for this image
    out_file = file_full_path + file_name + "_outlines.png"
    if os.path.isfile(out_file) == False :
        return "NO"
    inputPath = ""
    outputPath = ""
    out_file_name = ""
    #create grayscale image for training
    inputPath = file_full_path + file_name + "_mask.png"
    maks_img = Image.open(file_full_path + file_name + "_cp_masks.png").convert("RGBA")
    width, height = maks_img.size
    outX, outY = np.nonzero(masks)
    print('color_panel', masks[outX, outY])
    new_img = Image.new("RGB", (height, width), (255, 0, 0))
    image_blank = np.zeros((height, width), np.uint8)
    # image_blank[:0:width] = (0, 0, 255) # Green in BGR format
    new_overlay = plot.mask_overlay(image_blank, masks)
    new_overlay[outX, outY] = np.array([255,0,0]) #pure red 
    new_maks = Image.fromarray(new_overlay, 'RGB')
    new_maks.save(inputPath, 'PNG')
    if model_info['outline'] == 0 :
        im = Image.fromarray(imgout, 'RGB')
        rgb_im = im.convert('RGB')
        inputPath = file_full_path + file_name + "_conv_outlines.jpg"
        rgb_im.save(inputPath, 'JPEG')
        outputPath = file_full_path + file_name + "_conv_outlines.ome.tiff"
        out_file_name = file_name + "_conv_outlines.ome.tiff"
    if model_info['outline'] == 1 :
        im = Image.fromarray(overlay, 'RGB')
        rgb_im = im.convert('RGB')
        inputPath = file_full_path + file_name + "_conv_masks.jpg"
        rgb_im.save(inputPath, 'JPEG')
        outputPath = file_full_path + file_name + "_conv_masks.ome.tiff"
        out_file_name = file_name + "_conv_masks.ome.tiff"
    if model_info['outline'] == 2 :
        im = Image.fromarray(flows, 'RGB')
        rgb_im = im.convert('RGB')
        inputPath = file_full_path + file_name + "_conv_flows.jpg"
        rgb_im.save(inputPath, 'JPEG')
        outputPath = file_full_path + file_name + "_conv_flows.ome.tiff"
        out_file_name = file_name + "_conv_flows.ome.tiff"
    print('out_name', out_file_name)
    cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '" + inputPath + "' '" + outputPath + "'"
    print('=====>', out_file, outputPath, cmd_str)
    subprocess.run(cmd_str, shell=True)
    return out_file_name
    

async def get_model(model_name: str,
                              clear_previous: bool,
                              current_user: UserModelDB or ShowUserModel,
                              db: AsyncIOMotorDatabase) -> List[UserCustomModel]:
    model = [doc async for doc in
             db['usercustom'].find({'custom_name': model_name, 'user_id': current_user.id}, {'_id': 0, 'update_time': 0})]

    if model is None:
        return False

    print(model)
    return model
