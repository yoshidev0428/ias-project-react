import os
from fastapi.responses import JSONResponse
from fastapi import (
    Request,
    APIRouter,
    Depends,
    status,
    UploadFile,
    File,
    Form,
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from mainApi.app.auth.auth import get_current_user
from mainApi.app.db.mongodb import get_database
from mainApi.app.images.sub_routers.tile.models import (
    TileModelDB,
)
from mainApi.app.auth.models.user import UserModelDB, PyObjectId
from mainApi.config import STATIC_PATH, CURRENT_STATIC
from app.tiling.service import save_tiling_images

router = APIRouter(prefix="/tile", tags=["tile"])

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
    image_folder = 'images'
    image_folder_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)), image_folder)
    if not os.path.exists(image_folder_path):
        os.makedirs(image_folder_path)
    elif clear_previous:
        for f in os.listdir(image_folder_path):
                os.remove(os.path.join(image_folder_path, f))
        await db["tile-image-cache"].delete_many(
            {"user_id": PyObjectId(current_user.id)}
        )
    result = await save_tiling_images(
        path=image_folder_path,
        files=files,
        clear_previous=clear_previous,
        current_user=current_user,
        db=db,
    )
    result["path"] = os.path.join(CURRENT_STATIC, str(PyObjectId(current_user.id)), image_folder)
    return JSONResponse(result)