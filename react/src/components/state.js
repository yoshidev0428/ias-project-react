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
    DialogFilter2dflag: false,
    DialogFilter3dflag: false,
    dialogFlag: false,
    Dialog3dflag: false,
    Focusflag: false,
    Superflag: false,
    OpenCloudflag: false,
    OpenFileflag: false,
    DialogBasicFlag: false,
    DialogCustomFlag: false,
    DialogCustomNameFlag: false,
    DialogCellposeFlag: false,
    DialogVisualFlag: false
}

export const useFlagsStore = create(set => ({
    ...DEFAUlT_FLAG_STATE,
    ...generateToggles(DEFAUlT_FLAG_STATE, set),
}));