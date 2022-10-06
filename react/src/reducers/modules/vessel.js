const DEFAULT_PARAMS = {
    currentVesselType: "Well",
    selectedVesselHole: { row: 0, col: 1},
    selectedVesselZ: 0,
    viewConfigsObj: {},
};

const initState = {
    ...DEFAULT_PARAMS,
}

//action redux
const vessel = (state = initState, action) => {
    switch (action.type) {
        case "vessel_selectedVesselHole":
            state.selectedVesselHole = action.content;
            break
        case "vessel_selectedVesselZ":
            state.selectedVesselZ = action.content;
            break
        case "vessel_setCurrentVesselType":
            state.currentVesselType = action.data;
            break;
        case "vessel_setViewConfigsObj":
            state.viewConfigsObj = action.data;
            break;
        default:
            break;
    }
    return {...state}
};

export default vessel;