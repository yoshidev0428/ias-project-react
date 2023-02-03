const DEFAULT_PARAMS = {
    experiments: [],
    metainfo: null,
    uploading: false,
    viewinfo: {
        filetype: null,
        vessel: null,
        objective: null,
        channels: [],
        imagead: null,
        zposition: null,
        timeline: null
    }
};

const initState = {
    ...DEFAULT_PARAMS,
}

const experiment = (state = initState, action) => {
    switch (action.type) {
        case "set_experiment_data":
            state.experiments = action.content;
            break;
        case "setMetaInfo":
            state.metainfo = action.content;
            break;
        case "INIT_VIEW":
            state.viewinfo.vessel = 'Single-Slide';
            state.viewinfo.objective = 4;
            state.viewinfo.channels = [0];
            state.viewinfo.zposition = 1;
            state.viewinfo.timeline = 1;
        case "SET_NULL_VIEW":
            state.viewinfo.channels = [];
        default:
            break
    }
    return { ...state }
};

export default experiment;