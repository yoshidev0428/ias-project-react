import math
from typing import List

from celery_tasks.tasks import StitchingCeleryTask
from celery_tasks.utils import create_worker_from
from mainApi.app.images.sub_routers.tile.models import AlignNaiveRequest, AlignedTiledModel, TileModelDB


def align_tiles_naive(request: AlignNaiveRequest,
                      tiles: List[TileModelDB]) -> List[AlignedTiledModel]:
    """
        performs a naive aligning of the tiles simply based on the given rows and method.
        does not perform any advanced stitching or pixel checking.
        Does not use the row and column index, instead just iterates over the tiles in the order they are received.

        Meant to be called in a separate thread due it being cpu bound.
    """
    if len(tiles) == 0:
        return []

    # assumes they are all the same size
    width_px = tiles[0].width_px
    height_px = tiles[0].height_px

    columns = math.ceil(len(tiles) / request.rows)

    row = 0
    col = 0

    aligned_tiles: List[AlignedTiledModel] = []

    for index, tile in enumerate(tiles):
        if request.method == "byRow":
            col = index % columns
        else:
            row = index % request.rows

        tile = tile.dict()
        tile["offset_x"] = col * width_px
        tile["offset_y"] = row * height_px

        aligned_tiles.append(AlignedTiledModel.parse_obj(tile))

        if request.method == "byRow":
            if col == columns - 1:
                row = row + 1
        else:
            if row == request.rows - 1:
                col = col + 1

    return aligned_tiles


# create worker
_, stitching_worker = create_worker_from(StitchingCeleryTask)


def align_ashlar(tiles: List[TileModelDB], pattern: str) -> any:
    """
    Calls a celery task running on a separate container.
    Since celery hasn't implemented AsyncIO yet for some reason we must call this function in a asyncio.loop

    """

    tiles_dict_list = [t.json() for t in tiles]
    results = stitching_worker.apply_async(args=[],
                                           kwargs={'tiles': tiles_dict_list, 'pattern': pattern},
                                           serializer="json")

    return results.get()  # waits until celery task is complete.

