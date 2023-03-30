from fastapi import (
    FastAPI, APIRouter
)

from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware

import os
from ilastikApi.app.api.routers import router as api_router
from ilastikApi.config import ALLOWED_HOSTS
from fastapi.staticfiles import StaticFiles

middleware = [
    Middleware(
        CORSMiddleware,
        # allow_origins=['*'],
        allow_methods=['*'],
        allow_headers=['*'],
        allow_origins=['http://ias.lifeanalytics.org']
    )
]
app = FastAPI(title='IAS Project', middleware=middleware)

script_dir = os.path.dirname(__file__)
st_abs_file_path = os.path.join(script_dir, "static/")


def get_value():
    global st_abs_file_path
    return st_abs_file_path

if not os.path.isdir(st_abs_file_path):
    os.makedirs(st_abs_file_path)
app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")

if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["*"]


app.include_router(api_router)

test_router = APIRouter(
    prefix="/test",
    tags=["test"]
)


@test_router.get("", response_description="Test endpoint, will return the request")
async def _test(request: str = None):
    if request:
        return request
    else:
        return "Pass any string as 'request' query parameter and it will return it. ex. /test/?request=foo"


@app.get("/")
def read_root():
    return {"Ping": "Pong Ilastik"}


app.include_router(test_router)