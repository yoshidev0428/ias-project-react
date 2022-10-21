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