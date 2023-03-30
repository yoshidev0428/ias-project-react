import create from 'zustand';
import { getExperiments } from '@/api/experiment';

const DEFAULT_EXPERIMENT_STATE = {
  experiments: [],
  metadataMap: {},
  error: null,
};

export const useExperimentStore = create((set, get) => ({
  ...DEFAULT_EXPERIMENT_STATE,
  loadExperiments: async (force = false) => {
    if (!force && get().experiments.length) {
      return;
    }
    try {
      const { data } = await getExperiments();
      set((state) => ({ ...state, experiments: data }));
    } catch (err) {
      set((state) => ({ ...state, error: err }));
    }
  },
  updateMetadataMap: (metadata) =>
    set((state) => ({
      ...state,
      metadataMap: { ...state.metadataMap, ...metadata },
    })),
}));
