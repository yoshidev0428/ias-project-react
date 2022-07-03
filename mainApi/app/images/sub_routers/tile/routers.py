import asyncio
import concurrent
import os
import pydantic
from PIL import Image
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from fastapi import (
    Request,
    APIRouter,
    Depends,
    status,
    UploadFile,
    File, Form, HTTPException
)
from motor.motor_asyncio import AsyncIOMotorDatabase

from mainApi.app.auth.auth import get_current_user

from typing import List

from mainApi.app.db.mongodb import get_database
from mainApi.app.images.sub_routers.tile.models import AlignNaiveRequest, TileModelDB, AlignedTiledModel
from mainApi.app.images.utils.align_tiles import align_tiles_naive, align_ashlar
from mainApi.app.images.utils.file import save_upload_file, add_image_tiles, convol2D_processing
import mainApi.app.images.utils.deconvolution as Deconv
import mainApi.app.images.utils.super_resolution.functions as SuperRes_Func
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
from mainApi.config import STATIC_PATH
import aiofiles
import jsons
router = APIRouter(
    prefix="/tile",
    tags=["tile"],
)
@router.post("/upload_image_tiles", 
        response_description="Upload Image Tiles",
        status_code=status.HTTP_201_CREATED,
        response_model = List[TileModelDB])
async def upload_image_tiles(files: List[UploadFile] = File(...),
                    clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    file_path = STATIC_PATH.joinpath(files[0].filename)
    for f in os.listdir(STATIC_PATH):
        os.remove(os.path.join(STATIC_PATH, f))
        
    async with aiofiles.open(file_path, 'wb') as f:
        content = await files[0].read()
        await f.write(content)
    # cal = await add_image_tiles(path = file_path, files=files, clear_previous=clear_previous, current_user=current_user, db=db) 
    result = {"Flag_3d": True,
                "N_images": 10,
                "path_images": [files[0].filename]}
    return JSONResponse(result)

@router.post("/deconvol2D", 
        response_description="Convolution about 2D image",
        status_code=status.HTTP_201_CREATED,
        response_model = List[TileModelDB])
async def upload_image_name(files_name: str = Form(''),
                            effectiveness: int= Form(1),
                            isroi: bool = Form(False),
                            roiPoints: object = Form(...),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    files_name = files_name.split("/")[-1]
    dictRoiPts = jsons.loads(roiPoints)
    abs_path = Deconv.SupervisedColorDeconvolution(files_name, effectiveness, isroi, dictRoiPts)
    abs_path = abs_path.split("/")[-1]
    path = []
    path.append(abs_path)
    result = {"Flag_3d": False,
                "N_images": 1,
                "path_images":path}
    return JSONResponse(result)

@router.post("/deconvol3D",
        response_description="Deconvolution about 3D image",
        status_code=status.HTTP_201_CREATED,
        response_model = List[TileModelDB])
async def deconvol3D(gamma: float = Form(1.0),
                    file_name: str = '',
                    effectiveness: int= Form(1),
                    isroi: bool = Form(False),
                    roiPoints: object = Form(...),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    dictRoiPts = jsons.loads(roiPoints)             
    file_path = Deconv.RechardDeconvolution3d(file_name, effectiveness, isroi, dictRoiPts, gamma)
    cal = await add_image_tiles(path = file_path, files=File(...), clear_previous=Form(False), current_user=current_user, db=db) 
    result = {"Flag_3d": cal[0],
                "N_images": cal[1],
                "path_images": cal[2]}
    return JSONResponse(result)

@router.post("/SuperRes",
        response_description="image super resolution",
        status_code=status.HTTP_201_CREATED,
        response_model = List[TileModelDB])
async def SuperRes(file_name: str = Form(''),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    abs_path = SuperRes_Func.EDSuperResolution(file_name)
    abs_path = abs_path.split("/")[-1]
    path = []
    path.append(abs_path)

    result = {"Flag_3d": False,
                "N_images": 1,
                "path_images": path}
    return JSONResponse(result)

@router.get("/list",
            response_description="Upload Image Tiles",
            response_model=List[TileModelDB],
            status_code=status.HTTP_200_OK)
async def get_tile_list(current_user: UserModelDB = Depends(get_current_user),
                        db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    tiles = await db['tile-image-cache'].find({'user_id': current_user.id})["absolute_path"]
    return pydantic.parse_obj_as(List[TileModelDB], tiles)

@router.post("/update",
             response_description="Update Image Tiles",
             status_code=status.HTTP_200_OK)
async def update_tiles(tiles: List[TileModelDB],
                       current_user: UserModelDB = Depends(get_current_user),
                       db: AsyncIOMotorDatabase = Depends(get_database)):
    # make sure we are not trying to alter any tiles we do not own
    # we check this first and if they are trying to update any un owned docs we dont update any
    for tile in tiles:
        if tile.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Cannot update tile that does not belong to user",
                headers={"WWW-Authenticate": "Bearer"},
            )

    for tile in tiles:
        result = await db['tile-image-cache'].replace_one({'_id': tile.id}, tile.dict(exclude={'id'}))


@router.post("/delete",
             response_description="Update Image Tiles",
             status_code=status.HTTP_200_OK)
async def delete_tiles(tiles: List[TileModelDB],
                       current_user: UserModelDB = Depends(get_current_user),
                       db: AsyncIOMotorDatabase = Depends(get_database)):
    # make sure we are not trying to delete any tiles we do not own
    # we check this first and if they are trying to delete any un owned docs we dont update any
    for tile in tiles:
        if tile.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Cannot update tile that does not belong to user",
                headers={"WWW-Authenticate": "Bearer"},
            )

    results = []

    for tile in tiles:
        result = await db['tile-image-cache'].delete_one({'_id': tile.id})
        results.append(result)

    return results


@router.get("/align_tiles_naive",
            response_description="Align Tiles",
            response_model=List[AlignedTiledModel],
            status_code=status.HTTP_200_OK)
async def _align_tiles_naive(request: AlignNaiveRequest,
                             tiles: List[TileModelDB] = Depends(get_tile_list)) -> List[AlignedTiledModel]:
    """
        performs a naive aligning of the tiles simply based on the given rows and method.
        does not perform any advanced stitching or pixel checking

        Called using concurrent.futures to make it async
    """

    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        aligned_tiles = await loop.run_in_executor(pool, align_tiles_naive, request, tiles)  # await result

        return aligned_tiles


@router.get("/align_tiles_ashlar",
            response_description="Align Tiles",
            # response_model=List[AlignedTiledModel],
            status_code=status.HTTP_200_OK)
async def _align_tiles_ashlar(tiles: List[TileModelDB] = Depends(get_tile_list)) -> any:
    """
        performs a naive aligning of the tiles simply based on the given rows and method.
        does not perform any advanced stitching or pixel checking

        Called using concurrent.futures to make it async
    """

    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        aligned_tiles = await loop.run_in_executor(pool, align_ashlar, tiles,
                                                   "img_r{row:03}_c{col:03}.tif")  # await result

        return aligned_tiles


@router.get("/export_stitched_image",
            response_description="Export stitched Image",
            response_model=List[AlignedTiledModel],
            status_code=status.HTTP_200_OK)
# async def export_stitched_image(tiles: List[AlignedTiledModel]) -> List[TileModel]:
async def export_stitched_image() -> List[TileModelDB]:
    """ This is meant to called after the images are aligned, so it takes a list of AlignedTiledModel in the body """
    pass
    # loop = asyncio.get_event_loop()
    # with concurrent.futures.ProcessPoolExecutor() as pool:
    #     result = await loop.run_in_executor(pool, cpu_bound)  # wait result
    #     print(result)
