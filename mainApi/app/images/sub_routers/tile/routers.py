import asyncio
import concurrent
import os
import pydantic
from fastapi.responses import JSONResponse, FileResponse
from fastapi import (
    Request,
    Body,
    APIRouter,
    Depends,
    status,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Any, FrozenSet, List
import jsons
import string
from tokenize import String
from PIL import Image
import json
from bson import ObjectId, json_util
import uuid
import aiofiles
import subprocess

from mainApi.app.auth.auth import get_current_user
from mainApi.app.db.mongodb import get_database
from mainApi.app.images.sub_routers.tile.models import (
    AlignNaiveRequest,
    TileModelDB,
    FileModelDB,
    AlignedTiledModel,
    NamePattenModel,
    MergeImgModel,
    ExperimentModel,
    MetadataModel,
    UserCustomModel,
)
from mainApi.app.images.utils.align_tiles import align_tiles_naive, align_ashlar
from mainApi.app.images.utils.tiling import (
    add_image_tiles,
    delete_tiles_in,
    get_all_tiles,
)
from mainApi.app.images.utils.experiment import (
    add_experiment,
    add_experiment_with_folders,
    add_experiment_with_files,
    get_experiment_data,
    add_experiment_with_folder,
    convert_npy_to_jpg,
    get_model,
)
import mainApi.app.images.utils.deconvolution as Deconv
import mainApi.app.images.utils.super_resolution.functions as SuperResolution
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
from mainApi.config import STATIC_PATH, CURRENT_STATIC
import tifftools
from mainApi.app.images.utils.convert import get_metadata


# import bioformats
# from bioformats import logback
from mainApi.app.images.utils.contrastlimits import calculateImageStats
from mainApi.app.images.utils.focus_stack import focus_stack

import cv2

router = APIRouter(
    prefix="/tile",
    tags=["tile"],
)


# Upload Image file
@router.post(
    "/upload_tiles",
    response_description="Upload Image Tiles",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def upload_tiles(
    files: List[UploadFile] = File(...),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    current_user_path = os.path.join(
        STATIC_PATH, str(PyObjectId(current_user.id)), "images"
    )
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)
    elif clear_previous:
        for f in os.listdir(current_user_path):
            os.remove(os.path.join(current_user_path, f))
        await db["tile-image-cache"].delete_many(
            {"user_id": PyObjectId(current_user.id)}
        )
    result = await add_image_tiles(
        path=current_user_path,
        files=files,
        current_user=current_user,
        db=db,
    )
    return JSONResponse(result)


@router.get(
    "/get_tiles",
    response_description="Get all image tiles",
    status_code=status.HTTP_200_OK,
)
async def get_tiles(
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[FileModelDB]:
    tiles = await get_all_tiles(current_user, db)

    return JSONResponse(tiles)


@router.post(
    "/delete_tiles",
    response_description="Delete Tiles",
    status_code=status.HTTP_200_OK,
)
async def delete_tiles(
    tile_ids: List[str] = Form(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Any:
    res = await delete_tiles_in(tile_ids, db)
    return JSONResponse(res)


@router.post(
    "/update_tiles_meta_info",
    response_description="Delete Tiles",
    status_code=status.HTTP_200_OK,
)
async def update_tiles_meta_info(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Any:
    body_bytes = await request.body()
    data = json.loads(body_bytes)
    for meta_info in data["tiles_meta_info"]:
        await db["tile-image-cache"].update_one(
            {"_id": ObjectId(meta_info["_id"])},
            {
                "$set": {
                    "series": int(meta_info["series"]),
                }
            },
        )

@router.post(
    "/create_tiles",
    response_description="Delete Tiles",
    status_code=status.HTTP_200_OK,
)
async def create_tiles(
    request: Request,
    user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[FileModelDB]:
    body_bytes = await request.body()
    data = json.loads(body_bytes)
    tiles = []
    for tile_path in data["paths"]:
        tiles.append({
            "user_id": user.id,
            "filename": tile_path.rsplit('/', 1)[1],
            "path": f"{CURRENT_STATIC}/{user.id}/{tile_path}"
        })
    delete_res = await db["tile-image-cache"].delete_many(
        {"path": {"$in": [t.get("path") for t in tiles]}}
    )
    # insert new tile images
    insert_res = await db["tile-image-cache"].insert_many(tiles)
    inserted_ids = [str(id) for id in insert_res.inserted_ids]

    if delete_res.deleted_count == len(inserted_ids):
        return JSONResponse([])
    
    return JSONResponse(inserted_ids)

#############################################################################
# Register Experiment
#############################################################################
@router.post(
    "/register_experiment",
    response_description="Register Experiment",
    status_code=status.HTTP_201_CREATED,
    response_model=List[ExperimentModel],
)
async def register_experiment(
    request: Request,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    print(request)
    data = await request.form()

    files = data.get("images").split(",")
    experiment_name = data.get("experiment_name")
    result = await add_experiment(
        experiment_name,
        files,
        clear_previous=clear_previous,
        current_user=current_user,
        db=db,
    )
    return JSONResponse({"success": result})


#############################################################################
# Get Experiment data by name
#############################################################################
@router.get(
    "/get_experiment_data/{experiment_name}",
    response_description="Get Experiment Data",
    response_model=List[ExperimentModel],
)
async def get_image(
    experiment_name: str,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    # tiles = await db['experiment'].find({'experiment_name': "experiment_1"})
    # all_tiles = [doc async for doc in db['experiment'].find()]
    # print(all_tiles)

    tiles = [
        doc
        async for doc in db["experiment"].find(
            {"experiment_name": experiment_name, "user_id": current_user.id}
        )
    ]
    # print(tiles)
    if len(tiles) == 0:
        return JSONResponse(
            {"success": False, "error": "Cannot find the experiment data"}
        )

    experiment = tiles[0]
    files = experiment["fileNames"]

    metadatas = []
    for file in files:
        metadata = get_metadata(file)
        print("get_experiment_data:", file, metadata)
        metadatas.append(metadata)

    return JSONResponse({"success": True, "data": files, "metadata": metadatas})


#############################################################################
# Get Experiment names
#############################################################################
@router.get(
    "/get_experiment_names",
    response_description="Get Experiment names",
    response_model=List[str],
)
async def get_image(
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[str]:
    experiment_names = [
        doc["experiment_name"]
        async for doc in db["experiment"].find({"user_id": current_user.id})
    ]
    print(experiment_names)
    return JSONResponse({"success": True, "data": experiment_names})


#############################################################################
# Get Experiment datas
#############################################################################
@router.get(
    "/get_experiments_datas",
    response_description="Get Experiments",
    response_model=List[ExperimentModel],
)
async def get_experiments(
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    userId = str(PyObjectId(current_user.id))
    exp_datas = [
        doc
        async for doc in db["experiment"].find(
            {"user_id": userId}, {"_id": 0, "update_time": 0}
        )
    ]

    return JSONResponse({"success": True, "data": exp_datas})


#############################################################################
# Get Meta datas
#############################################################################
@router.get(
    "/get_meta_datas",
    response_description="Get Metadatas",
    response_model=List[MetadataModel],
)
async def get_metadatas(
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[MetadataModel]:
    userId = str(PyObjectId(current_user.id))
    meta_datas = [doc async for doc in db["metadata"].find({}, {"_id": 0})]
    return JSONResponse({"success": True, "data": meta_datas})


#############################################################################
# Get Image By its full path
#############################################################################
@router.post(
    "/get_image_by_path",
    response_description="Get Image By its full path",
    response_model=List[TileModelDB],
)
async def merge_image(
    merge_req_body: str = Body(embed=True),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    imagePath = merge_req_body

    return FileResponse(imagePath, media_type="image/tiff")


#############################################################################
# New Upload Image file


@router.post(
    "/upload_images/{folder_name}",
    response_description="Upload Files",
    status_code=status.HTTP_201_CREATED,
    response_model=List[FileModelDB],
)
async def upload_images(
    folder_name: str,
    files: List[UploadFile] = File(...),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[FileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    # Make user directory
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)

    # Check if the folder exists, if not make a new one
    path = os.path.join(current_user_path, folder_name)
    print(path)
    if os.path.isdir(path):
        result = {}
        result["error"] = "Folder is already existing"
        return JSONResponse(result)
    else:
        os.mkdir(path)
        res = await db["tile-image-cache"].delete_many(
            {"user_id": PyObjectId(current_user.id)}
        )
        result = await add_image_tiles(
            path=path,
            files=files,
            clear_previous=clear_previous,
            current_user=current_user,
            db=db,
        )
        result["path"] = os.path.join(
            CURRENT_STATIC, str(PyObjectId(current_user.id)) + "/" + folder_name
        )

    return JSONResponse(result)


#############################################################################
# New Upload Experiment with Folder


@router.post(
    "/set_experiment",
    response_description="Register Experiment",
    status_code=status.HTTP_201_CREATED,
    response_model=List[ExperimentModel],
)
async def register_experiment_with_folder(
    request: Request,
    files: List[UploadFile] = File(...),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    data = await request.form()
    # files = data.get('images')
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    new_experiment_path = os.path.join(current_user_path, data.get("experiment_name"))
    new_folder_path = os.path.join(new_experiment_path, data.get("folderName"))

    print("This is user path", current_user_path)
    print("This is experiment path", new_experiment_path)
    print("This is folder path", new_folder_path)
    # Make user directory
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)

    # # Check if the folder exists, if not make a new one
    # path = os.path.join(current_user_path, folder_name)
    # print(path)
    if os.path.isdir(new_experiment_path):
        result = {}
        result["exp_error"] = "Experiment name is already exist"
        return JSONResponse(result)
    else:
        os.mkdir(new_experiment_path)

    if os.path.isdir(new_folder_path):
        result = {}
        result["folder_error"] = "Folder name is already exist"
        return JSONResponse(result)
    else:
        os.mkdir(new_folder_path)
        # res = await db['tile-image-cache'].delete_many({"user_id": PyObjectId(current_user.id)})
        result = await add_experiment_with_folder(
            folderPath=new_experiment_path,
            experiment_name=data.get("experiment_name"),
            folderName=data.get("folderName"),
            files=files,
            clear_previous=clear_previous,
            current_user=current_user,
            db=db,
        )
    #     result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)) + "/" + folder_name)

    return JSONResponse(result)


@router.post(
    "/set_experiment_with_files",
    response_description="Register Experiment with Files",
    status_code=status.HTTP_201_CREATED,
    response_model=List[ExperimentModel],
)
async def register_experiment_with_folder(
    request: Request,
    files: List[UploadFile] = File(...),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    data = await request.form()
    # files = data.get('images')
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    new_experiment_path = os.path.join(current_user_path, data.get("experiment_name"))

    print("This is user path", current_user_path)
    print("This is experiment path", new_experiment_path)
    # Make user directory
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)

    if os.path.isdir(new_experiment_path):
        result = {}
        result["error"] = "Experiment name is already exist"
        return JSONResponse(result)
    else:
        os.mkdir(new_experiment_path)
        result = await add_experiment_with_files(
            folderPath=new_experiment_path,
            experiment_name=data.get("experiment_name"),
            files=files,
            clear_previous=clear_previous,
            current_user=current_user,
            db=db,
        )
    #     result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)) + "/" + folder_name)

    return JSONResponse(result)


#############################################################################
## Set Experiment with folders
@router.post(
    "/set_experiment_with_folders",
    response_description="Register with Folder",
    status_code=status.HTTP_201_CREATED,
    response_model=List[ExperimentModel],
)
async def register_experiment_with_folders(
    request: Request,
    files: List[UploadFile] = File(...),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[ExperimentModel]:
    data = await request.form()
    experiment_name = data.get("experiment_name")
    paths = data.get("path")
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    new_experiment_path = os.path.join(current_user_path, experiment_name)

    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)

    if not os.path.isdir(new_experiment_path):
        os.mkdir(new_experiment_path)

    result = await add_experiment_with_folders(
        folderPath=new_experiment_path,
        experiment_name=experiment_name,
        files=files,
        paths=paths,
        current_user=current_user,
        db=db,
        tiling=data.get("tiling"),
    )

    return JSONResponse(result)


# Return one Image file
@router.get(
    "/get_image/{folder}/{image}",
    response_description="Get Image Tiles",
    response_model=List[TileModelDB],
)
async def get_image(
    image: str,
    folder: str,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    print("image get", folder, image)
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    metadata_for_single_img = get_metadata(
        os.path.join(current_user_path + "/" + folder, image)
    )
    print("This metadata for single data--------", metadata_for_single_img)
    return FileResponse(
        os.path.join(current_user_path + "/" + folder, image), media_type="image/tiff"
    )


# Return Image tree
@router.get(
    "/get_image_tree",
    response_description="Get Image Tiles",
    response_model=List[FileModelDB],
)
async def get_image(
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[FileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))

    if os.path.isdir(current_user_path) == False:
        os.mkdir(current_user_path)
        return JSONResponse({"error": "You have no image data, please upload"})

    sub_dirs = os.listdir(current_user_path)
    if len(sub_dirs) == 0:
        return JSONResponse({"error": "You have no image data, please upload"})

    output = [
        dI
        for dI in os.listdir(current_user_path)
        if os.path.isdir(os.path.join(current_user_path, dI))
    ]
    response = []

    for folderName in output:
        current_folder = os.path.join(current_user_path, folderName)
        files = [
            {"value": os.path.join(current_folder, f), "label": f}
            for f in os.listdir(current_folder)
            if os.path.isfile(os.path.join(current_folder, f))
        ]
        response.append(
            {"value": current_folder, "label": folderName, "children": files}
        )

    return JSONResponse({"data": response})


# Return merge Image files
@router.post(
    "/get_merged_image",
    response_description="Get Image Tiles",
    response_model=List[TileModelDB],
)
async def merge_image(
    merge_req_body: str = Body(embed=True),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    reqbody = merge_req_body.split("&")

    images = reqbody[0].split(",")
    newImageName = reqbody[1]

    tff_lst = [os.path.join(current_user_path + "/", image) for image in images]
    print("requested image list:\n", tff_lst)
    if len(tff_lst) > 0 and os.path.isfile(tff_lst[0]):
        if os.path.isfile(os.path.join(current_user_path + "/", newImageName)):
            return FileResponse(
                os.path.join(current_user_path + "/", newImageName),
                media_type="image/tiff",
            )
        tff = tifftools.read_tiff(tff_lst[0])
        for other in tff_lst[1:]:
            if os.path.isfile(other):
                othertff = tifftools.read_tiff(other)
                tff["ifds"].extend(othertff["ifds"])
        tifftools.write_tiff(tff, os.path.join(current_user_path + "/", newImageName))
        return FileResponse(
            os.path.join(current_user_path + "/", newImageName), media_type="image/tiff"
        )
    else:
        return JSONResponse({"error": "Requested images are not exist!"})
    # return JSONResponse({"aa": tff_lst[0], "bb": newImageName})
    # return JSONResponse({"aa": merge_req_body.fileNames, 'bb': merge_req_body.newImageName})


# Alignment tilings
@router.get(
    "/list",
    response_description="Upload Image Tiles",
    response_model=List[TileModelDB],
    status_code=status.HTTP_200_OK,
)
async def get_tile_list(
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    print(current_user, "tiles -----------")
    tiles = await db["tile-image-cache"].find({"user_id": current_user.id})[
        "absolute_path"
    ]
    return pydantic.parse_obj_as(List[TileModelDB], tiles)


@router.get(
    "/align_tiles_naive",
    response_description="Align Tiles",
    response_model=List[AlignedTiledModel],
    status_code=status.HTTP_200_OK,
)
async def _align_tiles_naive(
    request: AlignNaiveRequest, tiles: List[TileModelDB] = Depends(get_tile_list)
) -> List[AlignedTiledModel]:
    """
    performs a naive aligning of the tiles simply based on the given rows and method.
    does not perform any advanced stitching or pixel checking

    Called using concurrent.futures to make it async
    """
    print(tiles, " : align_tiles_naive : ----------------------------")
    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        # await result
        aligned_tiles = await loop.run_in_executor(
            pool, align_tiles_naive, request, tiles
        )
        return aligned_tiles


# @router.get("/align_tiles_ashlar",
#             response_description="Align Tiles",
#             # response_model=List[AlignedTiledModel],
#             status_code=status.HTTP_200_OK)
# async def _align_tiles_ashlar(tiles: List[TileModelDB] = Depends(get_tile_list)) -> any:
#     """
#         performs a naive aligning of the tiles simply based on the given rows and method.
#         does not perform any advanced stitching or pixel checking

#         Called using concurrent.futures to make it async
#     """

#     loop = asyncio.get_event_loop()
#     with concurrent.futures.ProcessPoolExecutor() as pool:
#         # await result
#         aligned_tiles = await loop.run_in_executor(pool, align_ashlar, tiles, "img_r{row:03}_c{col:03}.tif")
#         return aligned_tiles


# Update Name and File - Name&&File Functions
@router.post(
    "/update",
    response_description="Update Image Tiles With Name",
    status_code=status.HTTP_200_OK,
)
async def update(
    tiles: List[NamePattenModel],
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # make sure we are not trying to alter any tiles we do not own
    # we check this first and if they are trying to update any un owned docs we dont update any
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    current_files = []
    current_row = 0
    current_col = 1
    for tile in tiles:
        additional_tile = {
            "file_name": tile.filename,
            "series": tile.series,
            "row_index": tile.row,
            "column_index": tile.col,
            "channel": tile.channel,
            "field": tile.field,
            "z_position": tile.z_position,
            "time_point": tile.time_point,
        }
        await db["tile-image-cache"].update_one(
            {"file_name": tile.filename}, {"$set": additional_tile}
        )


# View Controls
@router.post(
    "/deconvol2D",
    response_description="Convolution about 2D image",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def upload_image_name(
    files_name: str = Form(""),
    effectiveness: int = Form(1),
    isroi: bool = Form(False),
    roiPoints: object = Form(...),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    files_name = files_name.split("/")[-1]
    dictRoiPts = jsons.loads(roiPoints)
    abs_path = Deconv.SupervisedColorDeconvolution(
        files_name, effectiveness, isroi, dictRoiPts
    )
    abs_path = abs_path.split("/")[-1]
    path = []
    path.append(abs_path)
    result = {"Flag_3d": False, "N_images": 1, "path_images": path}
    return JSONResponse(result)


@router.post(
    "/deconvol3D",
    response_description="Deconvolution about 3D image",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def deconvol3D(
    gamma: float = Form(1.0),
    file_name: str = "",
    effectiveness: int = Form(1),
    isroi: bool = Form(False),
    roiPoints: object = Form(...),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    dictRoiPts = jsons.loads(roiPoints)
    file_path = Deconv.RechardDeconvolution3d(
        file_name, effectiveness, isroi, dictRoiPts, gamma
    )
    cal = await add_image_tiles(
        path=file_path,
        files=File(...),
        clear_previous=Form(False),
        current_user=current_user,
        db=db,
    )
    result = {"Flag_3d": cal[0], "N_images": cal[1], "path_images": cal[2]}
    return JSONResponse(result)


@router.get(
    "/super-resolution/{experiment}/{filename}/{scale}",
    response_description="image super resolution",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def GetSuperResolution(
    experiment: str,
    filename: str,
    scale: int,
    user: UserModelDB = Depends(get_current_user),
) -> List[TileModelDB]:
    filepath = os.path.join(STATIC_PATH, str(user.id), experiment, filename, scale)
    out_filepath = SuperResolution.EDSuperResolution(filepath)
    rel_path = out_filepath.rsplit(str(STATIC_PATH), 1)[1]

    return JSONResponse({"result": rel_path})


@router.post(
    "/delete", response_description="Update Image Tiles", status_code=status.HTTP_200_OK
)
async def delete_tiles(
    tiles: List[TileModelDB],
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
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
        result = await db["tile-image-cache"].delete_one({"_id": tile.id})
        results.append(result)
    return results


@router.get(
    "/export_stitched_image",
    response_description="Export stitched Image",
    response_model=List[AlignedTiledModel],
    status_code=status.HTTP_200_OK,
)
# async def export_stitched_image(tiles: List[AlignedTiledModel]) -> List[TileModel]:
async def export_stitched_image() -> List[TileModelDB]:
    """This is meant to called after the images are aligned, so it takes a list of AlignedTiledModel in the body"""
    pass
    # loop = asyncio.get_event_loop()
    # with concurrent.futures.ProcessPoolExecutor() as pool:
    #     result = await loop.run_in_executor(pool, cpu_bound)  # wait result
    #     print(result)


#############################################################################
# Get Image Raw Data
#############################################################################
@router.get(
    "/get_channel_states/{concatedName}", response_description="Get Image Raw Data"
)
async def get_image_raw_data(
    concatedName: str,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # experiment_names = [doc['experiment_name'] async for doc in db['experiment'].find()]
    # if len(experiment_names) <= 0:
    #     return JSONResponse({"success": False, "error": "Cannot find the experiment name"})
    # experiment_name = experiment_names[0]

    pos = concatedName.find("&")
    experiment_name = concatedName[(pos + 1 - len(concatedName)) :]
    imageName = concatedName[0:pos]
    print("get_image_raw_data: ", concatedName, experiment_name, imageName)

    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    image_path = os.path.join(current_user_path + "/", experiment_name + "/", imageName)
    print("get_image_raw_data: ", image_path)
    if not os.path.isfile(image_path):
        return JSONResponse({"success": False, "error": "Cannot find the image"})

    # logback.basic_config()
    # image, scale = bioformats.load_image(image_path, rescale=False, wants_max_intensity=True)

    # raw_data = []
    # for r in range(0, image.shape[0]):
    #     for c in range(0, image.shape[1]):
    #         raw_data.append(image[r][c])

    # return StreamingResponse(io.BytesIO(image.tobytes()), media_type="image/raw")

    domain, contrastLimits = calculateImageStats(image_path)
    return JSONResponse(
        {
            "success": True,
            "domain": [int(domain[0]), int(domain[1])],
            "contrastLimits": [int(contrastLimits[0]), int(contrastLimits[1])],
        }
    )


# Get focus stacked images
@router.post(
    "/focus-stack",
    response_description="Get focus stacked images",
    status_code=status.HTTP_200_OK,
    response_model=List[TileModelDB],
)
async def get_focus_stacked(
    imageFiles: List[UploadFile] = File(...),
) -> List[TileModelDB]:
    tmp_uuid = str(uuid.uuid4())
    tmp_path = os.path.join(STATIC_PATH, "tmp", tmp_uuid)
    os.makedirs(tmp_path)

    input_path = os.path.join(tmp_path, "input")
    os.makedirs(input_path)

    output_path = os.path.join(tmp_path, "output")
    os.makedirs(output_path)

    for imageFile in imageFiles:
        imagePath = os.path.join(input_path, imageFile.filename)
        async with aiofiles.open(imagePath, "wb") as f:
            imageData = await imageFile.read()
            await f.write(imageData)

    image_files = sorted(os.listdir(input_path))
    for img in image_files:
        if img.split(".")[-1].lower() not in ["jpg", "jpeg", "png"]:
            image_files.remove(img)

    focusimages = []
    for img in image_files:
        print("Reading in file {}".format(img))
        focusimages.append(
            cv2.imread("{input}/{file}".format(input=input_path, file=img))
        )

    output_file_path = os.path.join(output_path, "merged.png")
    merged = focus_stack(focusimages)
    cv2.imwrite(output_file_path, merged)

    return JSONResponse({"result": "static/tmp/{}/output/merged.png".format(tmp_uuid)})

@router.post("/test_segment",
             response_description="Test Segment",
             status_code=status.HTTP_201_CREATED,
             response_model=List[ExperimentModel])
async def test_segment(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    # print(request)
    data = await request.form()
    file_url = data.get("file_url")
    model_name = data.get("model_name")
    model = await get_model(model_name=model_name,clear_previous=clear_previous , current_user=current_user, db=db)
    print('my_model', model[0]['custom_name'])
    # parameter control
    custom_method = model[0]['custom_method']
    viewValue = model[0]['viewValue']
    outline = model[0]['outline']
    cell_diam = model[0]['cell_diam']
    chan_segment = model[0]['chan_segment']
    chan_2 = model[0]['chan_2']
    f_threshold = model[0]['f_threshold']
    c_threshold = model[0]['c_threshold']
    s_threshold = model[0]['s_threshold']
    #Get file's full abs path
    file_url = file_url.replace('download/?path=', '')
    temp_url = file_url.split('/')
    temp_length = len(temp_url)
    file_url = temp_url[temp_length-2] + '/' + temp_url[temp_length-1];
    print('file_url', file_url)

    exp_path = os.path.join(current_user_path, file_url)
    exp_path = os.path.abspath(exp_path)
    directory = exp_path.split('/')
    directory_length = len(directory)
    make_new_folder = ""
    for i in range(directory_length - 2):
        make_new_folder = make_new_folder + '/' + directory[i+1]
    make_new_folder = make_new_folder + "/"
    #Get file's name except type
    file_full_name = directory[directory_length-1]
    file_name_array = file_full_name.split(".")
    file_name = ""
    file_name_length = len(file_name_array)
    for i in range(file_name_length - 1):
        if(i == 0):
            file_name = file_name + file_name_array[i]
        if(i>0):
            file_name = file_name + '.' + file_name_array[i]
    print('file_name', file_name)
    # Run cellpose and test cell segmnent
    command_string = "python -m cellpose --image_path \"{file_full_path}\" --pretrained_model {custom_method} --chan {chan_segment} --chan2 {chan_2} --diameter {cell_diam} --stitch_threshold {s_threshold} --flow_threshold {f_threshold} --cellprob_threshold {c_threshold} --fast_mode  --save_png  --save_flows --save_outlines --save_ncolor".format(file_full_path=exp_path, custom_method=custom_method, chan_segment=chan_segment, chan_2=chan_2, cell_diam=cell_diam, s_threshold=s_threshold, f_threshold=f_threshold, c_threshold=c_threshold)
    print("my_command", command_string)
    os.system(command_string)
    result = await convert_npy_to_jpg(file_full_path=make_new_folder,clear_previous=clear_previous , model_info = model[0],file_name=file_name, current_user=current_user)
    delete_junk_data(file_url, make_new_folder)
    return JSONResponse({"success": result})

def delete_junk_data(file_name, 
            dir_name,
            current_user: UserModelDB = Depends(get_current_user),
            db: AsyncIOMotorDatabase = Depends(get_database)
)-> List[UserCustomModel]:
    origin_name = file_name.split('.ome.tiff')[0]
    origin_name = origin_name.split('/')[1]
    #delete segmentation files 
    seg_output = origin_name + '.ome_cp_output.png'
    print('seg_output', dir_name + seg_output)
    if(os.path.isfile(dir_name + seg_output)) :
        os.unlink(dir_name + seg_output)
    seg_dp = dir_name + origin_name + '.ome_dP.tif'
    if(os.path.isfile(seg_dp)) :
        os.unlink(seg_dp)
    seg_flow = dir_name + origin_name + '.ome_flows.tif'
    if(os.path.isfile(seg_flow)) :
        os.unlink(seg_flow)
    seg_input_mask = dir_name + origin_name + '.ome_mask.jpg'
    if(os.path.isfile(seg_input_mask)) :
        os.unlink(seg_input_mask)
    seg_res_mask = dir_name + origin_name + '.ome_conv_masks.jpg'
    if(os.path.isfile(seg_res_mask)) :
        os.unlink(seg_res_mask)
    seg_outline = dir_name + origin_name + '.ome_outlines.png'
    if(os.path.isfile(seg_outline)) :
        os.unlink(seg_outline)
    #delete training files
    dir_name = dir_name + 'train/'
    train_img = dir_name + origin_name + '_img.tiff'
    if(os.path.isfile(train_img)) :
        os.unlink(train_img)
    train_mask_flow = dir_name + origin_name + '_img_flows.tif'
    if(os.path.isfile(train_mask_flow)) :
        os.unlink(train_mask_flow)
    train_mask = dir_name + origin_name + '_masks.tiff'
    if(os.path.isfile(train_mask)) :
        os.unlink(train_mask)

@router.post(
    "/save_model",
    response_description="Save Model",
    status_code=status.HTTP_201_CREATED,
    response_model=List[UserCustomModel],
)
async def save_model(
    request: Request,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[UserCustomModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    data = await request.form()
    custom_name = data.get("custom_name")
    usercustom = UserCustomModel(
        user_id=PyObjectId(current_user.id),
        custom_method=data.get("custom_method"),
        custom_name=data.get("custom_name"),
        custom_icon=data.get("custom_icon"),
        viewValue=data.get("viewValue"),
        outline=data.get("outline"),
        cell_diam=data.get("cell_diam"),
        chan_segment=data.get("chan_segment"),
        chan_2=data.get("chan_2"),
        f_threshold=data.get("f_threshold"),
        c_threshold=data.get("c_threshold"),
        s_threshold=data.get("s_threshold"),
    )
    print("model-name", usercustom)
    # print('model_info', dir(usercustom))
    models = [
        doc
        async for doc in db["usercustom"].find(
            {"custom_name": custom_name, "user_id": current_user.id}
        )
    ]
    if len(models) > 0:
        return JSONResponse({"error": "NO"})
    else:
        await db["usercustom"].insert_one(usercustom.dict(exclude={"id"}))
    return JSONResponse({"success": "OK"})

@router.post("/get_models",
             response_description="Get Model",
             status_code=status.HTTP_201_CREATED,
             response_model=List[UserCustomModel])
async def get_models(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[UserCustomModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    data = await request.form()
    model = 'all'
    models = []
    if model == 'all' :
        models = [doc async for doc in
                db['usercustom'].find({'user_id': current_user.id}, {'_id': 0, 'update_time': 0})]
    else :
        models = [doc async for doc in
             db['usercustom'].find({'custom_name': model, 'user_id': current_user.id}, {'_id': 0, 'update_time': 0})]
    for mo in models :
        mo['user_id'] = ''
    print('models', models)
    if len(models) == 0:
        return JSONResponse({"error": "NO"})
    return JSONResponse({"success": True, "data": models})

@router.post("/get_outlines",
             response_description="Get outlines",
             status_code=status.HTTP_201_CREATED,
             response_model=List[ExperimentModel])
async def get_outlines(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    # print(request)
    data = await request.form()
    file_url = data.get("file_url")
    #Get file's full abs path
    file_url = file_url.replace('download/?path=', '')
    temp_url = file_url.split('/')
    temp_length = len(temp_url)
    file_url = temp_url[temp_length-2] + '/' + temp_url[temp_length-1]
    print('file_url', file_url)
    exp_path = os.path.join(current_user_path, file_url)
    exp_path = os.path.abspath(exp_path)
    directory = exp_path.split('/')
    directory_length = len(directory)
    make_new_folder = ""
    for i in range(directory_length - 2):
        make_new_folder = make_new_folder + '/' + directory[i+1]
    make_new_folder = make_new_folder + "/"
    #Get file's name except type
    file_full_name = directory[directory_length-1]
    file_name_array = file_full_name.split(".")
    file_name = ""
    file_name_length = len(file_name_array)
    for i in range(file_name_length - 1):
        if(i == 0):
            file_name = file_name + file_name_array[i]
        if(i>0):
            file_name = file_name + '.' + file_name_array[i]
    outlines = []
    valid_file_name = file_name
    if file_name.find('_conv_masks') == -1 :
        valid_file_name = file_name
    else :
        valid_file_name = file_name.split('_conv_masks')[0]
    if os.path.isfile(make_new_folder + valid_file_name + '_cp_outlines.txt') == False :
        return JSONResponse({"success": 'NO'})
    else :
        with open(make_new_folder + valid_file_name + '_cp_outlines.txt') as file:
            for item in file:
                outlines.append(item)
    return JSONResponse({"success": outlines})

@router.post("/train_model",
             response_description="Train Model",
             status_code=status.HTTP_201_CREATED,
             response_model=List[ExperimentModel])
async def train_model(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    # print(request)
    data = await request.form()
    file_url = data.get("file_url")
    init_model = data.get("init_model")
    model_name = data.get("model_name")
    segment = data.get("segment")
    chan2 = data.get("chan2")
    weight_decay = data.get("weight_decay")
    learning_rate = data.get("learning_rate")
    n_epochs = data.get("n_epochs")
    #Get file's full abs path
    file_url = file_url.replace('download/?path=', '')
    temp_url = file_url.split('/')
    temp_length = len(temp_url)
    file_url = temp_url[temp_length-2] + '/' + temp_url[temp_length-1]
    print('file_url', file_url)
    exp_path = os.path.join(current_user_path, file_url)
    exp_path = os.path.abspath(exp_path)
    directory = exp_path.split('/')
    directory_length = len(directory)
    make_new_folder = ""
    for i in range(directory_length - 2):
        make_new_folder = make_new_folder + '/' + directory[i+1]
    make_new_folder = make_new_folder + "/"
    #Get file's name except type
    file_full_name = directory[directory_length-1]
    print('file_name', file_full_name)
    print('file_folder', make_new_folder)
    origin_file = ""
    if "_conv_outlines.ome.tiff" in file_full_name:
        file_temp = file_full_name.split('.ome_conv_outlines.ome.tiff')
        origin_file = file_temp[0]
    if "_conv_masks.ome.tiff" in file_full_name:
        file_temp = file_full_name.split('.ome_conv_masks.ome.tiff')
        origin_file = file_temp[0]
    if "_conv_flows.ome.tiff" in file_full_name:
        file_temp = file_full_name.split('.ome_conv_flows.ome.tiff')
        origin_file = file_temp[0]
    print('origin_file', origin_file)
    original_img = origin_file + ".ome.tiff"
    original_mask = origin_file + ".ome_cp_masks.png"
    mask_img = Image.open(make_new_folder + original_img)
    inputPath = make_new_folder + original_mask
    make_new_folder = make_new_folder + 'train/'
    if os.path.isdir(make_new_folder):
        make_new_folder = make_new_folder
    else:
        os.mkdir(make_new_folder)
    mask_img.save(make_new_folder + origin_file + "_img.tiff")
    outputPath = make_new_folder + origin_file + "_masks.tiff"
    out_file = origin_file + "_mask.ome.tiff"
    cmd_str = "sh /app/mainApi/bftools/bfconvert -separate -overwrite '" + inputPath + "' '" + outputPath + "'"
    print('=====>', out_file, outputPath, cmd_str)
    subprocess.run(cmd_str, shell=True)
    # Train user custom model
    command_string = "python -m cellpose --train --dir {make_new_folder} --pretrained_model {init_model} --chan {segment} --chan2 {chan_2} --img_filter _img --mask_filter _masks --learning_rate {learning_rate} --weight_decay {weight_decay} --n_epochs {n_epochs}  ".format(make_new_folder=make_new_folder, init_model=init_model, segment=segment, chan_2=chan2, learning_rate=learning_rate, weight_decay=weight_decay, n_epochs=n_epochs)
    print("my_command", command_string)
    os.system(command_string)
    result = 'OK'
    return JSONResponse({"success": result})
