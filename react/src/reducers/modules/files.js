const DEFAULT_PARAMS = {
    isFilesAvailable: false,
    isContentAvailable: false,
    files: null,
    filesChosen: null,
    isFilesChosenAvailable: false,
    content: null,
};

const initState = {
    ...DEFAULT_PARAMS,
}

//action redux
const files = (state = initState, action) => {
    switch (action.type) {
        case "content_addContent":
            state.content = action.content;
            state.isContentAvailable = true;
            break;
        case "files_addFiles":
            state.files = action.content;
            state.isFilesAvailable = true;
            break
        case "files_removeAllFiles":
            state.files = null;
            state.isFilesAvailable = false;
            break;
        case "files_addFilesChosen":
            state.filesChosen = action.content;
            state.isFilesAvailable = true;
            break
        default:
            break;
    }
    return { ...state }
};

export default files;