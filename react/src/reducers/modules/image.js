const DEFAULT_PARAMS = {
    is3dView: false,
};

const initState = {
    ...DEFAULT_PARAMS,
}

const image = (state = initState, action) => {
    switch (action.type) {
        case "set_3d_view_mode":
            state.is3dView = action.content;
            break;
        default:
            break;
    }
    return { ...state }
};

export default image;