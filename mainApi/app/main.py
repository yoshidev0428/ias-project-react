import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware

from mainApi.app.auth.routers import router as auth_router
from mainApi.app.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from mainApi.app.images.routers import router as image_router
from mainApi.config import ALLOWED_HOSTS

import javabridge
import bioformats

middleware = [
    Middleware(
        CORSMiddleware,
        # allow_origins=['*'],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_origins=["http://ias.lifeanalytics.org"],
    )
]
app = FastAPI(title="IAS Project", middleware=middleware)

static_path = os.path.join(os.path.dirname(__file__), "static/")

if not os.path.isdir(static_path):
    os.makedirs(static_path)

app.mount("/static", StaticFiles(directory=static_path), name="static")

if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["*"]


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    javabridge.start_vm(class_path=bioformats.JARS, run_headless=True)


@app.on_event("shutdown")
async def shutdown_event():
    javabridge.kill_vm()
    close_mongo_connection()


# ================= Routers  ===============
app.include_router(auth_router)
app.include_router(image_router)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}
