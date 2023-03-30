import os

# ----------------- Database variables (MongoDB) --------------------------

# --------------- Storage/Volume variables, must match the location set in docker-compose.yml -----------------------
from pathlib import Path

from starlette.datastructures import CommaSeparatedStrings
STATIC_PATH = Path(os.path.join(os.path.dirname(__file__), "app/static/"))
CURRENT_STATIC = Path('/static')
IMAGE_PATH = Path('/image-storage')
CACHE_PATH = Path('/cache-storage')
# CACHE_PATH = Path(os.path.join(os.path.dirname(__file__), "app/static/cache-storage"))

ALLOWED_HOSTS = CommaSeparatedStrings(os.getenv("ALLOWED_HOSTS", ""))
