const DEFAULT_PARAMS = {
    currentVesselType: "Well",
    viewConfigsObj: {},
};

const initState = {
    ...DEFAULT_PARAMS,
}

//action redux
const vessel = (state = initState, action) => {
    switch (action.type) {
        case "vessel_setCurrentVesselType":
            state.currentVesselType = action.data;
            break;
        case "vessel_setViewConfigsObj":
            state.viewConfigsObj = action.data;
            break;
        default:
            break;
    }
    return { ...state }
};

export default vessel;