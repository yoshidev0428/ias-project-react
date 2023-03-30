import { getExperiments } from '@/api/experiment';
import create from 'zustand';

const DEFAULT_EXPERIMENT_STATE = {
  experiments: [],
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
}));
