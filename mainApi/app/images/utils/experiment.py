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

async def add_experiment(expName: str, fileNames: List[str],
						clear_previous: bool,
					    current_user: UserModelDB or ShowUserModel,
					    db: AsyncIOMotorDatabase) -> ExperimentModel:
	tiles = [doc async for doc in db['experiment'].find({'expName': expName, 'user_id': current_user.id})]
	if len(tiles) > 0:
		return False

	experiment = ExperimentModel(
		user_id=PyObjectId(current_user.id),
		expName=expName,
		fileNames=fileNames
	)
	await db['experiment'].insert_one(experiment.dict(exclude={'id'}))
	return True

async def add_experiment_with_folder (folderPath: str,
									expName: str,
									folderName: str,
									files: List[UploadFile],
									clear_previous: bool,
									current_user: UserModelDB or ShowUserModel,
									db: AsyncIOMotorDatabase) -> ExperimentModel:
	print("This is experiment part", folderName, expName, folderPath)	
	print(files)
	setfiles = []						  
	for each_file_folder in files:
		file_name_folder = each_file_folder.filename
		setfiles.append(file_name_folder)
		file_path_folder = os.path.join(folderPath, file_name_folder)        
		async with aiofiles.open(file_path_folder, 'wb') as f:
			content_folder = await each_file_folder.read()
			await f.write(content_folder)
	experimentData = {
                'user_id': str(PyObjectId(current_user.id)),
                'expName': expName,
                'folders': [{
					'folderName': folderName,
					'files': setfiles
				}],
				'date': datetime.now()
			}
	print("success")
	await db['experiment'].insert_one(experimentData)
	return True
async def add_experiment_with_folders (folderPath: str,
									expName: str,
									files: List[UploadFile],
									paths: List[str],
									clear_previous: bool,
									current_user: UserModelDB or ShowUserModel,
									db: AsyncIOMotorDatabase) -> ExperimentModel:
	index = 0				
	folders = []
	files_in_folder = []
	files_in_experiment = []
	print("This is folder path------------>", folderPath)
	edited_paths = paths.split(",")
	for each_file_folder in files:
		index = index + 1
		directory = []
		print(index)
		print("--------------------------->")
		if '/' not in edited_paths[index-1]:
			print("this is file")
			folders.append({
						"folder": edited_paths[index-2].split('/'),
						"files": files_in_folder
					})
			make_new_folder = folderPath
			files_in_folder = []
			files_in_experiment.append(each_file_folder.filename)
		else:
			if not edited_paths[index-1][0]=='/':
				edited_paths[index-1]='/' + edited_paths[index-1]
			directory = edited_paths[index-1].split('/')
			directory_length = len(directory)
			make_new_folder = folderPath
			is_not_exist = False
			for i in range(directory_length-2):
				print("this is sub directory", directory[i+1])
				make_new_folder = make_new_folder + '/' + directory[i+1]
				if not os.path.exists(make_new_folder):
					os.makedirs(make_new_folder)
					is_not_exist = True
			if is_not_exist:
				if index > 1:
					folders.append({
						"folder": edited_paths[index-2].split('/'),
						"files": files_in_folder
					})
					folder_name = make_new_folder
					files_in_folder = []
		
		if '/' in each_file_folder.filename:
			new_folder_path = folderPath + '/' + each_file_folder.filename
			files_in_folder.append(each_file_folder.filename.split('/')[len(each_file_folder.filename.split('/')) - 1])
		else:
			files_in_folder.append(each_file_folder.filename)
			new_folder_path = make_new_folder + '/' + each_file_folder.filename
		
		print("this is folder name", make_new_folder)
		print("this is filename", each_file_folder.filename)
		if index == len(files):
			folders.append({
					"folder": edited_paths[index-1].split('/'),
					"files": files_in_folder
				})
			
		async with aiofiles.open(new_folder_path, 'wb') as f:
			content_folder = await each_file_folder.read()
			await f.write(content_folder)
		
	experimentData = {
                'user_id': str(PyObjectId(current_user.id)),
                'expName': expName,
                'folders': folders,
				'date': datetime.now()
			}
	print("success")
	await db['experiment'].insert_one(experimentData)
	return True

async def add_experiment_with_files (folderPath: str,
									expName: str,
									files: List[UploadFile],
									clear_previous: bool,
									current_user: UserModelDB or ShowUserModel,
									db: AsyncIOMotorDatabase) -> ExperimentModel:
	print("This is experiment part", expName, folderPath)	
	print(files)
	setfiles = []						  
	for each_file_folder in files:
		file_name_folder = each_file_folder.filename
		setfiles.append(file_name_folder)
		file_path_folder = os.path.join(folderPath, file_name_folder)        
		async with aiofiles.open(file_path_folder, 'wb') as f:
			content_folder = await each_file_folder.read()
			await f.write(content_folder)
	experimentData = {
                'user_id': str(PyObjectId(current_user.id)),
                'expName': expName,
                'files': setfiles,
				'date': datetime.now()
			}
	print("success")
	await db['experiment'].insert_one(experimentData)
	return True

# async def add_experiment_name(expName: str,
# 						clear_previous: bool,
# 					    current_user: UserModelDB or ShowUserModel,
# 					    db: AsyncIOMotorDatabase) -> ExperimentModel:
# 	tiles = [doc async for doc in db['experiment'].find({'expName': expName, 'user_id': current_user.id})]
# 	if len(tiles) > 0:
# 		return False

# 	experiment = ExperimentModel(
# 		user_id=PyObjectId(current_user.id),
# 		expName=expName
# 	)
# 	await db['experiment'].insert_one(experiment.dict(exclude={'id'}))
# 	return True

async def get_experiment_data(expName: str, user_id: str,
							clear_previous: bool,
						    current_user: UserModelDB or ShowUserModel,
						    db: AsyncIOMotorDatabase) -> List[str]:
	cursor = await db['experiment'].find_one({"expName": expName, "user_id": user_id})
	experiment = pydantic.parse_obj_as(ExperimentModel, cursor)

	if experiment is None:
		return False

	print(experiment)
	return experiment