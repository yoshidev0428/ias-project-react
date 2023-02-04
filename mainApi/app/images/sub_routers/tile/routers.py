import asyncio
import concurrent
import os
import pydantic
from pydantic import BaseModel
import string
from tokenize import String
from PIL import Image
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from starlette.responses import StreamingResponse
from fastapi import (
    Request,
    Response,
    Body,
    APIRouter,
    Depends,
    status,
    UploadFile,
    File, Form, HTTPException
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import aiofiles
import jsons

from mainApi.app.auth.auth import get_current_user
from mainApi.app.db.mongodb import get_database
from mainApi.app.images.sub_routers.tile.models import AlignNaiveRequest, TileModelDB, FileModelDB, AlignedTiledModel, NamePattenModel, MergeImgModel, ExperimentModel
from mainApi.app.images.utils.align_tiles import align_tiles_naive, align_ashlar
from mainApi.app.images.utils.file import save_upload_file, add_image_tiles, convol2D_processing
from mainApi.app.images.utils.experiment import add_experiment, get_experiment_data
import mainApi.app.images.utils.deconvolution as Deconv
import mainApi.app.images.utils.super_resolution.functions as SuperRes_Func
from mainApi.app.images.utils.folder import get_user_cache_path, clear_path
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
from mainApi.config import STATIC_PATH, CURRENT_STATIC
import tifftools
from mainApi.app.images.utils.convert import get_metadata


# import javabridge
# import bioformats
# from bioformats import logback
from mainApi.app.images.utils.contrastlimits import calculateImageStats

# javabridge.start_vm(class_path=bioformats.JARS)


router = APIRouter(
    prefix="/tile",
    tags=["tile"],
)

# Upload Image file
@router.post("/upload_image_tiles",
             response_description="Upload Image Tiles",
             status_code=status.HTTP_201_CREATED,
             response_model=List[TileModelDB])
async def upload_image_tiles(files: List[UploadFile] = File(...),
                             clear_previous: bool = Form(False),
                             current_user: UserModelDB = Depends(get_current_user),
                             db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
                             
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    if not os.path.exists(current_user_path):
        os.makedirs(current_user_path)
    else:
        for f in os.listdir(current_user_path):
            os.remove(os.path.join(current_user_path, f))
        res = await db['tile-image-cache'].delete_many({"user_id": PyObjectId(current_user.id)})
    result = await add_image_tiles(path = current_user_path, files=files, clear_previous=clear_previous, current_user=current_user, db=db)
    result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)))
    return JSONResponse(result)

#############################################################################
# Delete Image files
#############################################################################
@router.post("/delete_image_files",
             response_description="Delete Image Tiles",
             status_code=status.HTTP_201_CREATED,
             response_model=List[TileModelDB])
async def delete_images(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    data = await request.form()
    files = data.get("images").split(',')
    for filePath in files:
        if not os.path.exists(filePath):
            #return JSONResponse({error: "You are attemting to delete non-existing file"})
            continue
        if not os.path.isfile(filePath): 
            #return JSONResponse({error: "You are attemting to delete folder, not file"})
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
@router.post("/register_experiment",
             response_description="Register Experiment",
             status_code=status.HTTP_201_CREATED,
             response_model=List[ExperimentModel])
async def delete_images(request: Request,
                         clear_previous: bool = Form(False),
                         current_user: UserModelDB = Depends(get_current_user),
                         db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    print(request)
    data = await request.form()

    files = data.get("images").split(',')
    expName = data.get('expName')
    result = await add_experiment(expName, files, clear_previous=clear_previous, current_user=current_user, db=db)
    return JSONResponse({"success": result})

#############################################################################
# Get Experiment data by name
#############################################################################
@router.get("/get_experiment_data/{expName}", 
            response_description="Get Experiment Data",
            response_model=List[ExperimentModel])
async def get_image(expName: str,
                    clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    # tiles = await db['experiment'].find({'expName': "experiment_1"})
    # all_tiles = [doc async for doc in db['experiment'].find()]
    #print(all_tiles)

    tiles = [doc async for doc in db['experiment'].find({'expName': expName, 'user_id': current_user.id})]
    #print(tiles)
    if len(tiles) == 0:
        return JSONResponse({"success": False, "error": "Cannot find the experiment data"})

    experiment = tiles[0]
    files = experiment['fileNames']

    metadatas = []
    for file in files:
        metadata = get_metadata(file)
        print("get_experiment_data:", file, metadata)
        metadatas.append(metadata)

    return JSONResponse({"success": True, "data": files, "metadata": metadatas})

#############################################################################
# Get Experiment names
#############################################################################
@router.get("/get_experiment_names", 
            response_description="Get Experiment names",
            response_model=List[str])
async def get_image(clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[str]:
    expNames = [doc['expName'] async for doc in db['experiment'].find({'user_id': current_user.id})]
    print(expNames)
    return JSONResponse({"success": True, "data": expNames})

#############################################################################
# Get Experiment datas
#############################################################################
@router.get("/get_experiments_datas", 
            response_description="Get Experiments",
            response_model=List[ExperimentModel])
async def get_experiments(clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[ExperimentModel]:
    print("this is current user", current_user)
    tiles = [doc['fileNames'] async for doc in db['experiment'].find({'user_id': current_user.id})]
    expNames = [doc['expName'] async for doc in db['experiment'].find({'user_id':current_user.id})]
    
    return JSONResponse({"success": True, "data": tiles, "expName": expNames})

    

#############################################################################
# Get Image By its full path
#############################################################################
@router.post("/get_image_by_path",
            response_description="Get Image By its full path",
            response_model=List[TileModelDB])
async def merge_image(merge_req_body: str = Body(embed=True),
                    clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    imagePath = merge_req_body

    return FileResponse(imagePath, media_type="image/tiff")

#############################################################################
# New Upload Image file
@router.post("/upload_images/{folder_name}",
             response_description="Upload Files",
             status_code=status.HTTP_201_CREATED,
             response_model=List[FileModelDB])
async def upload_images(folder_name: str,
                        files: List[UploadFile] = File(...),
                        clear_previous: bool = Form(False),
                        current_user: UserModelDB = Depends(get_current_user),
                        db: AsyncIOMotorDatabase = Depends(get_database)) -> List[FileModelDB]:
                             
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
        res = await db['tile-image-cache'].delete_many({"user_id": PyObjectId(current_user.id)})
        result = await add_image_tiles(path = path, files=files, clear_previous=clear_previous, current_user=current_user, db=db)
        result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)) + "/" + folder_name)

    return JSONResponse(result)

# Return one Image file
@router.get("/get_image/{folder}/{image}", 
            response_description="Get Image Tiles",
            response_model=List[TileModelDB])
async def get_image(image: str,
                    folder: str,
                    clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    print('image get', folder, image)
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    metadata_for_single_img = get_metadata(os.path.join(current_user_path + '/' + folder, image))
    print('This metadata for single data--------', metadata_for_single_img)
    return FileResponse(os.path.join(current_user_path + '/' + folder, image), media_type="image/tiff")

# Return Image tree
@router.get("/get_image_tree", 
            response_description="Get Image Tiles",
            response_model=List[FileModelDB])
async def get_image(clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[FileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))

    if os.path.isdir(current_user_path) == False:
        os.mkdir(current_user_path)
        return JSONResponse({"error": "You have no image data, please upload"})

    sub_dirs = os.listdir(current_user_path)
    if len(sub_dirs) == 0:
        return JSONResponse({"error": "You have no image data, please upload"})

    output = [dI for dI in os.listdir(current_user_path) if os.path.isdir(os.path.join(current_user_path,dI))]
    response = []

    for folderName in output:
        current_folder = os.path.join(current_user_path, folderName)
        files = [{"value": os.path.join(current_folder, f), "label": f} for f in os.listdir(current_folder) if os.path.isfile(os.path.join(current_folder, f))]
        response.append({
            "value": current_folder,
            "label": folderName,
            "children": files
        })        

    return JSONResponse({"data": response})

# Return merge Image files
@router.post("/get_merged_image",
            response_description="Get Image Tiles",
            response_model=List[TileModelDB])
async def merge_image(merge_req_body: str = Body(embed=True),
                    clear_previous: bool = Form(False),
                    current_user: UserModelDB = Depends(get_current_user),
                    db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    reqbody = merge_req_body.split('&')

    images = reqbody[0].split(',')
    newImageName = reqbody[1]

    tff_lst = [os.path.join(current_user_path + '/', image) for image in images]
    print("requested image list:\n", tff_lst)
    if (len(tff_lst) > 0 and os.path.isfile(tff_lst[0])):
        if os.path.isfile(os.path.join(current_user_path + '/', newImageName)):
            return FileResponse(os.path.join(current_user_path + '/', newImageName), media_type="image/tiff")
        tff = tifftools.read_tiff(tff_lst[0])
        for other in tff_lst[1:]:
            if os.path.isfile(other):
                othertff = tifftools.read_tiff(other)
                tff['ifds'].extend(othertff['ifds'])
        tifftools.write_tiff(tff, os.path.join(current_user_path + '/', newImageName))
        return FileResponse(os.path.join(current_user_path + '/', newImageName), media_type="image/tiff")
    else:
        return JSONResponse({'error': "Requested images are not exist!"})
    # return JSONResponse({"aa": tff_lst[0], "bb": newImageName})
    # return JSONResponse({"aa": merge_req_body.fileNames, 'bb': merge_req_body.newImageName})

# Alignment tilings
@router.get("/list",
            response_description="Upload Image Tiles",
            response_model=List[TileModelDB],
            status_code=status.HTTP_200_OK)
async def get_tile_list(current_user: UserModelDB = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    print( current_user, "tiles -----------")
    tiles = await db['tile-image-cache'].find({'user_id': current_user.id})["absolute_path"]
    return pydantic.parse_obj_as(List[TileModelDB], tiles)

@router.get("/align_tiles_naive",
            response_description="Align Tiles",
            response_model=List[AlignedTiledModel],
            status_code=status.HTTP_200_OK)
async def _align_tiles_naive(request: AlignNaiveRequest, tiles: List[TileModelDB] = Depends(get_tile_list)) -> List[AlignedTiledModel]:
    """
        performs a naive aligning of the tiles simply based on the given rows and method.
        does not perform any advanced stitching or pixel checking

        Called using concurrent.futures to make it async
    """
    print(tiles, " : align_tiles_naive : ----------------------------")
    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        # await result
        aligned_tiles = await loop.run_in_executor(pool, align_tiles_naive, request, tiles)
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
@router.post("/update",
             response_description="Update Image Tiles With Name",
             status_code=status.HTTP_200_OK)
async def update(tiles: List[NamePattenModel],
                       current_user: UserModelDB = Depends(get_current_user),
                       db: AsyncIOMotorDatabase = Depends(get_database)):
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
            "time_point": tile.time_point
        }
        await db['tile-image-cache'].update_one({'file_name': tile.filename}, {"$set": additional_tile})
            
# View Controls
@router.post("/deconvol2D",
             response_description="Convolution about 2D image",
             status_code=status.HTTP_201_CREATED,
             response_model=List[TileModelDB])
async def upload_image_name(files_name: str = Form(''),
                            effectiveness: int = Form(1),
                            isroi: bool = Form(False),
                            roiPoints: object = Form(...),
                            current_user: UserModelDB = Depends(get_current_user),
                            db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    files_name = files_name.split("/")[-1]
    dictRoiPts = jsons.loads(roiPoints)
    abs_path = Deconv.SupervisedColorDeconvolution(
        files_name, effectiveness, isroi, dictRoiPts)
    abs_path = abs_path.split("/")[-1]
    path = []
    path.append(abs_path)
    result = {"Flag_3d": False,
              "N_images": 1,
              "path_images": path}
    return JSONResponse(result)


@router.post("/deconvol3D",
             response_description="Deconvolution about 3D image",
             status_code=status.HTTP_201_CREATED,
             response_model=List[TileModelDB])
async def deconvol3D(gamma: float = Form(1.0),
                     file_name: str = '',
                     effectiveness: int = Form(1),
                     isroi: bool = Form(False),
                     roiPoints: object = Form(...),
                     current_user: UserModelDB = Depends(get_current_user),
                     db: AsyncIOMotorDatabase = Depends(get_database)) -> List[TileModelDB]:
    dictRoiPts = jsons.loads(roiPoints)
    file_path = Deconv.RechardDeconvolution3d(
        file_name, effectiveness, isroi, dictRoiPts, gamma)
    cal = await add_image_tiles(path=file_path, files=File(...), clear_previous=Form(False), current_user=current_user, db=db)
    result = {"Flag_3d": cal[0],
              "N_images": cal[1],
              "path_images": cal[2]}
    return JSONResponse(result)


@router.post("/SuperRes",
             response_description="image super resolution",
             status_code=status.HTTP_201_CREATED,
             response_model=List[TileModelDB])
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

#############################################################################
# Get Image Raw Data
#############################################################################
@router.get("/get_channel_states/{concatedName}", 
            response_description="Get Image Raw Data")
async def get_image_raw_data(
            concatedName: str, 
            clear_previous: bool = Form(False),
            current_user: UserModelDB = Depends(get_current_user),
            db: AsyncIOMotorDatabase = Depends(get_database)):

    # expNames = [doc['expName'] async for doc in db['experiment'].find()]
    # if len(expNames) <= 0:
    #     return JSONResponse({"success": False, "error": "Cannot find the experiment name"})
    # expName = expNames[0]

    pos = concatedName.find('&')
    expName = concatedName[(pos + 1 - len(concatedName)):]
    imageName = concatedName[0:pos]
    print("get_image_raw_data: ", concatedName, expName, imageName)

    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
    image_path = os.path.join(current_user_path + '/', expName+ '/', imageName)
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
    return JSONResponse({"success": True, "domain": [int(domain[0]), int(domain[1])], 
        "contrastLimits": [int(contrastLimits[0]), int(contrastLimits[1])]})