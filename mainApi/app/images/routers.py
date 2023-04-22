import os

from fastapi import (
    APIRouter,
    HTTPException,
    Request,
    Response,
    Depends
)
from fastapi.responses import JSONResponse, FileResponse
from mainApi.app.images.sub_routers.tile.routers import router as tile_router
from mainApi.config import STATIC_PATH
from mainApi.app.auth.auth import get_current_user
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
import subprocess
from datetime import date

import h5py as h5

router = APIRouter(prefix="/image", tags=[])

router.include_router(tile_router)

@router.get("/download")
async def download_exp_image(
    request: Request,
    path: str
):
    full_path = f"{STATIC_PATH}/{path}"
    file_size = os.path.getsize(full_path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    range = request.headers["Range"]
    if range is None:
        return FileResponse(full_path, filename=path)
    ranges = range.replace("bytes=", "").split("-")
    range_start = int(ranges[0]) if ranges[0] else None
    range_end = int(ranges[1]) if ranges[1] else file_size - 1
    if range_start is None:
        return Response(content="Range header required", status_code=416)
    if range_start >= file_size:
        return Response(content="Range out of bounds", status_code=416)
    if range_end >= file_size:
        range_end = file_size - 1
    content_length = range_end - range_start + 1
    headers = {
        "Content-Range": f"bytes {range_start}-{range_end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
    }
    with open(full_path, "rb") as file:
        file.seek(range_start)
        content = file.read(content_length)
        return Response(content, headers=headers, status_code=206)

@router.post(
    "/before_process",
    response_description="Process image",
)
async def processImage(request: Request, current_user: UserModelDB = Depends(get_current_user)):
    data = await request.form()
    print("get-request-data:", data)
    imagePath = '/app/mainApi/app/static/' + str(PyObjectId(current_user.id)) + '/' + data.get("original_image_url")
    folderName = date.today().strftime("%y%m%d%H%M%s")
    sharedImagePath = os.path.join("/app/shared_static", folderName)

    if not os.path.exists(sharedImagePath):
        os.makedirs(sharedImagePath)

    fileName = imagePath.split("/")[len(imagePath.split("/")) - 1]
    newImagePath = os.path.join(sharedImagePath, fileName)

    cmd_str = "cp '{inputPath}' '{outputPath}'".format(
        inputPath=imagePath, outputPath=newImagePath
    )
    subprocess.call(cmd_str, shell=True)

    return JSONResponse({"success": "success", "image_path": newImagePath})

@router.get("/test")
def read_root():
    print('sdfsdfsdf')
    with h5.File('example.h5', 'w') as f:
    # create a group
        group = f.create_group('mygroup')
        
        # create a dataset inside the group
        data = [1, 2, 3, 4, 5]
        group.create_dataset('mydata', data=data)
    
# read the data from the file
    with h5.File('example.h5', 'r') as f:
        # get the dataset
        dataset = f['mygroup/mydata']
        
        # print the dataset
        print(dataset[:])
    return {"Ping": "Pang"}