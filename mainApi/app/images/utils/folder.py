import os
import shutil
from pathlib import Path
from mainApi.config import IMAGE_PATH, CACHE_PATH


def get_user_image_path(user_id: str, directory: str) -> Path:
    """ returns the Path and creates the directory if it does not exist """
    
    path = Path(CACHE_PATH)
    path.mkdir(parents=True, exist_ok=True)
    path = CACHE_PATH.joinpath(user_id).joinpath(directory)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_user_cache_path(user_id: str, directory: str) -> Path:
    """ returns the Path and creates the directory if it does not exist """
    path = CACHE_PATH.joinpath(user_id).joinpath(directory)
    path.mkdir(parents=True, exist_ok=True)
    return path


def clear_path(path: Path):
    """ Clears folder, including deleting sub folders  """
    for filename in os.listdir(path):
        file_path = path.joinpath(filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
