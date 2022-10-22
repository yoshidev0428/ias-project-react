const DEFAULT_PARAMS = {
    experiments: [],
    uploading: false
};

const initState = {
    ...DEFAULT_PARAMS,
}

const experiment = (state = initState, action) => {
    switch (action.type) {
        case "set_experiment_data":
            state.experiments = action.content;
            break;
        default:
            break
    }
    return { ...state }
};

export default experiment;