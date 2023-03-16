import os

from fastapi import (
    APIRouter,
    HTTPException,
    Request,
    Response
)
from fastapi.responses import FileResponse

from mainApi.app.images.sub_routers.tile.routers import router as tile_router
from mainApi.config import STATIC_PATH

router = APIRouter(prefix="/image", tags=[])

router.include_router(tile_router)

@router.get("/file/{user_id}/{exp_name}/{folder}/{filename}")
async def download_exp_image(
    request: Request,
    filename: str,
    folder: str,
    exp_name: str,
    user_id: str
):
    full_path = f"{STATIC_PATH}/{user_id}/{exp_name}/{folder}/{filename}"
    file_size = os.path.getsize(full_path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    range = request.headers["Range"]
    if range is None:
        return FileResponse(full_path, filename=filename)
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
