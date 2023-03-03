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
    },
    metadatas: [],
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
        
        default:
            break
    }
    return { ...state }
};

export default experiment;