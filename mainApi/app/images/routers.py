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

router.include_router(tile_router)
