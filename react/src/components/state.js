import create from 'zustand';

const captialize = string => string.charAt(0).toUpperCase() + string.slice(1);

const generateToggles = (defaults, set) => {
  const toggles = {};
  Object.entries(defaults).forEach(([k, v]) => {
    if (typeof v === 'boolean') {
      toggles[`toggle${captialize(k)}`] = () =>
        set(state => ({
          ...state,
          [k]: !state[k]
        }));
    }
  });
  return toggles;
};

const DEFAUlT_FLAG_STATE = {
  dialogFlag: false,
  Dialog3dflag: false,
  Focusflag: false,
  Superflag: false,
  OpenCloudflag: false,
  OpenFileflag: false
};

export const useFlagsStore = create(set => ({
  ...DEFAUlT_FLAG_STATE,
  ...generateToggles(DEFAUlT_FLAG_STATE, set),
}));