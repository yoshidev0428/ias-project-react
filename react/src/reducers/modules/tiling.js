const DEFAULT_PARAMS = {
    tiling_selectedFile: null,
    // currentVesselType: "Well",
    // selectedVesselHole: { row: 0, col: 1},
    // selectedVesselZ: 0,
    // selectedVesselTime: 0,
    // viewConfigsObj: {},
};

const initState = {
    ...DEFAULT_PARAMS,
    folderName: "",
}

//action redux
const tiling = (state = initState, action) => {
    switch (action.type) {
        case "tiling_selectedFile":
            state.tiling_selectedFile = action.content;
            break

        case "SET_FOLDER_NAME":
            state.folderName = action.payload;
            break
        // case "vessel_selectedVesselHole":
        //     state.selectedVesselHole = action.content;
        //     break
        // case "vessel_selectedVesselZ":
        //     state.selectedVesselZ = action.content;
        //     break
        // case "vessel_selectedVesselTime":
        //     state.selectedVesselTime = action.content;
        //     break
        // case "vessel_setCurrentVesselType":
        //     state.currentVesselType = action.data;
        //     break;
        // case "vessel_setViewConfigsObj":
        //     state.viewConfigsObj = action.data;
        //     break;
        default:
            break;
    }
    return {...state}
};

export default tiling;