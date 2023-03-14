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
from typing import List
import jsons
import uuid
import aiofiles

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
)
from mainApi.app.images.utils.align_tiles import align_tiles_naive, align_ashlar
from mainApi.app.images.utils.file import (
    save_upload_file,
    add_image_tiles,
    convol2D_processing,
)
from mainApi.app.images.utils.experiment import (
    add_experiment,
    add_experiment_with_folders,
    add_experiment_with_files,
    get_experiment_data,
    add_experiment_with_folder,
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
    "/upload_image_tiles",
    response_description="Upload Image Tiles",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def upload_image_tiles(
    files: List[UploadFile] = File(...),
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)
    else:
        for f in os.listdir(current_user_path):
            os.remove(os.path.join(current_user_path, f))
        res = await db["tile-image-cache"].delete_many(
            {"user_id": PyObjectId(current_user.id)}
        )
    result = await add_image_tiles(
        path=current_user_path,
        files=files,
        clear_previous=clear_previous,
        current_user=current_user,
        db=db,
    )
    result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)))
    return JSONResponse(result)


#############################################################################
# Delete Image files
#############################################################################
@router.post(
    "/delete_image_files",
    response_description="Delete Image Tiles",
    status_code=status.HTTP_201_CREATED,
    response_model=List[TileModelDB],
)
async def delete_images(
    request: Request,
    clear_previous: bool = Form(False),
    current_user: UserModelDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    data = await request.form()
    files = data.get("images").split(",")
    for filePath in files:
        if not os.path.exists(filePath):
            # return JSONResponse({error: "You are attemting to delete non-existing file"})
            continue
        if not os.path.isfile(filePath):
            # return JSONResponse({error: "You are attemting to delete folder, not file"})
            continue
        os.remove(filePath)

    for f in os.listdir(current_user_path):
        path = os.path.join(current_user_path, f)
        if os.path.isdir(path) and len(os.listdir(path)) == 0:
            os.rmdir(path)

    return JSONResponse({"success": "success"})


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
    )
    #     result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)) + "/" + folder_name)

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
