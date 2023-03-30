from pathlib import Path
import glob

import os
from typing import List

import pytest
import shutil
from motor.motor_asyncio import AsyncIOMotorDatabase
from starlette import status

from mainApi.app.auth.models.user import CreateUserModel, CreateUserReplyModel

from httpx import AsyncClient

from mainApi.app.images.sub_routers.tile.models import TileModelDB
from mainApi.config import CACHE_PATH


class TestImagesTiles:

    @pytest.mark.asyncio
    async def test_upload_image_tiles(self,
                                      async_client_auth: AsyncClient,
                                      created_user: CreateUserReplyModel,
                                      db: AsyncIOMotorDatabase):
        test_tile_folder = Path("./test_image_tiles/")
        file_paths = glob.glob(str(test_tile_folder.absolute()) + '/*')
        files = [open(path, 'rb') for path in file_paths]

        # https://www.python-httpx.org/advanced/#multipart-file-encoding
        files_request = [('files', (os.path.basename(file.name), file, 'image/tiff')) for file in files]

        response = await async_client_auth.post(url="image/tile/upload_image_tiles", files=files_request)

        assert response.status_code == status.HTTP_201_CREATED

        data = response.json()

        tiles = [TileModelDB.parse_obj(tile) for tile in data]

        assert len(tiles) == len(files)
        print("======= testing ")
        assert tiles[0].width_px == 1392
        assert tiles[0].height_px == 1040

        assert tiles[0].file_name == "img_r001_c00.tif"
        assert tiles[0].absolute_path == str(CACHE_PATH
                                             .joinpath(str(created_user.user.id))
                                             .joinpath("tiles")
                                             .joinpath(tiles[0].file_name))

        assert tiles[0].user_id == created_user.user.id
        assert tiles[0].content_type == 'image/tiff'

        folder_path = Path(tiles[0].absolute_path).parent.parent

        # manually delete the folder
        shutil.rmtree(str(folder_path))

    @pytest.mark.asyncio
    async def test_tiles_list(self,
                              async_client_auth: AsyncClient,
                              created_user: CreateUserReplyModel,
                              db: AsyncIOMotorDatabase,
                              tiles: List[TileModelDB]):

        response = await async_client_auth.get(url="image/tile/list")

        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        tiles = [TileModelDB.parse_obj(tile) for tile in data]

        assert len(tiles) == 3


