from fastapi import (
    APIRouter, Depends,
)

from mainApi.app.auth.auth import get_current_user
from mainApi.app.images.sub_routers.tile.routers import router as tile_router

router = APIRouter(
    prefix="/image",
    tags=[],
    dependencies=[Depends(get_current_user)]
)

## Output OME-TIFF from static folder image files
#@router.get("/read_ome_tiff",
#            response_description="Read OME-TIFF",
#            response_model=
#            status_code=status.HTTP_200_OK,
#    current_user_path = os.path.join(STATIC_PATH, str(PyObjectId(current_user.id)))
#
#    convert_to_ome_format(current_user_path,  
#
#    return FileResponse(imagePath, media_type="image/tiff")

router.include_router(tile_router)
