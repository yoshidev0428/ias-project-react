import create from 'zustand';
import { getTiles } from '@/api/tiling';
import { toThumbnailPath } from '@/helpers/avivator';
import { toUrl } from '@/helpers/file';

const DEFAULT_TILES_STATE = {
  tiles: [],
  error: null,
  loading: true,
};

const toTiles = (images) =>
  images.map((tile) => ({
    ...tile,
    url: toUrl(tile.path),
    thumbnail: toUrl(toThumbnailPath(tile.path)),
  }));

export const useTilingStore = create((set) => ({
  ...DEFAULT_TILES_STATE,
  loadTiles: async () => {
    set((state) => ({ ...state, loading: true }));
    let tiles = [];
    try {
      tiles = await getTiles();
      set((state) => ({ ...state, tiles: toTiles(tiles) }));
    } catch (err) {
      set((state) => ({ ...state, error: err }));
    }
    set((state) => ({ ...state, loading: false }));
    return tiles;
  },
  setTiles: (tiles) =>
    set((state) => ({
      ...state,
      tiles: toTiles(tiles),
    })),
}));

export default useTilingStore;
