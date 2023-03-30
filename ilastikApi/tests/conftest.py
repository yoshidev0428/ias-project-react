import glob
import time

import asyncio
from pathlib import Path
from typing import List

import httpx
import os
import pytest
import shutil
from fastapi import UploadFile
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from starlette import status

from mainApi.app.auth.auth import create_user
from mainApi.app.auth.models.user import CreateUserModel, CreateUserReplyModel
from mainApi.app.db.mongodb import get_database, get_database_client
from mainApi.app.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from mainApi.app.images.sub_routers.tile.models import TileModelDB
from mainApi.app.images.sub_routers.tile.routers import upload_image_tiles
from mainApi.app.images.utils.file import add_image_tiles
from mainApi.app.main import app
from mainApi.config import MONGO_DB_NAME, CACHE_PATH


class BearerAuth(httpx.Auth):
    def __init__(self, token_type, token):
        self._token_type = token_type
        self._token = token

    def auth_flow(self, request):
        request.headers["Authorization"] = f"{self._token_type} {self._token}"
        yield request


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop()

    yield loop


@pytest.fixture(scope="module")
async def async_client() -> AsyncClient:
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client


@pytest.fixture(scope="function")
async def async_client_auth(async_client, created_user) -> AsyncClient:
    async_client.auth = BearerAuth(token_type=created_user.token_type, token=created_user.access_token)
    yield async_client


@pytest.fixture(scope="function")
async def async_client_auth_admin(async_client, created_user, db) -> AsyncClient:
    update_result = await db["users"].update_one({"_id": created_user.user.id}, {"$set": {"isAdmin": True}})

    async_client.auth = BearerAuth(token_type="Bearer", token=created_user.access_token)
    yield async_client


@pytest.fixture(scope="function")
async def db() -> AsyncIOMotorDatabase:
    await connect_to_mongo()
    db = await get_database()
    yield db

    db_client = await get_database_client()

    assert MONGO_DB_NAME == "test_db"

    db_client.drop_database(MONGO_DB_NAME)  # delete testDB after test
    time.sleep(2)  # gotta sleep here for a while so there is time to delete the db before running next test

    await close_mongo_connection()


@pytest.fixture()
def user_to_create(scope="module") -> CreateUserModel:
    test_user = CreateUserModel(
        full_name="Test User",
        email="test@test.com",
        password="password",  # plain text password
    )

    yield test_user


@pytest.fixture()
def other_user_to_create(scope="module") -> CreateUserModel:
    test_user = CreateUserModel(
        full_name="Other Test User",
        email="other_test@test.com",
        password="other_password",  # plain text password
    )

    yield test_user


@pytest.fixture(scope="function")
async def created_user(user_to_create, db) -> CreateUserReplyModel:
    created_user = await create_user(user_to_create, db)

    yield created_user


@pytest.fixture(scope="function")
async def other_created_user(other_user_to_create, db) -> CreateUserReplyModel:
    created_user = await create_user(other_user_to_create, db)

    yield created_user


@pytest.fixture(scope="function")
async def tiles(db, created_user) -> List[TileModelDB]:

    test_tile_folder = Path("./test_image_tiles/")
    file_paths = glob.glob(str(test_tile_folder.absolute()) + '/*')
    files = [open(path, 'rb') for path in file_paths]

    upload_files = []
    for file in files:
        upload_files.append(UploadFile(filename=os.path.basename(file.name), file=file, content_type="image/tiff"))

    tiles: List[TileModelDB] = await add_image_tiles(files=upload_files,
                                                     clear_previous=True,
                                                     current_user=created_user.user,
                                                     db=db)

    yield tiles

    folder_path = Path(tiles[0].absolute_path).parent.parent
    shutil.rmtree(str(folder_path)) # delete the folder


