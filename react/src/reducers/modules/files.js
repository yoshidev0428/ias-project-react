const DEFAULT_PARAMS = {
  isFilesAvailable: false,
  isContentAvailable: false,
  filesName: null,
  filesPath: null,
  filesChosen: null,
  isFilesChosenAvailable: false,
  content: null,
  isImageLoading: false,
  experimentName: null,
  selectedImage: null,
  imagePathForAvivator: null,
  imagePathForTree: '',
  selectedFilesForDropZone: '',
};

const initState = {
  ...DEFAULT_PARAMS,
};

//action redux
const files = (state = initState, action) => {
  switch (action.type) {
    case 'Select_Image':
      state.selectedImage = action.payload;
      break;
    case 'Cancel_Image':
      state.selectedImage = null;
      break;
    case 'content_addContent':
      state.content = action.content;
      state.isContentAvailable = true;
      state.isImageLoading = true;
      break;
    case 'files_addFiles':
      state.filesName = action.content.filesName;
      state.filesPath = action.content.filesPath;
      state.isFilesAvailable = true;
      break;
    case 'files_removeAllFiles':
      state.files = null;
      state.isFilesAvailable = false;
      break;
    case 'image_loading_state_change':
      state.isImageLoading = action.content;
      break;
    case 'register_experiment_name':
      state.experimentName = action.content;
      break;
    case 'set_image_path_for_avivator':
      state.imagePathForAvivator = action.content;
      break;
    case 'set_image_path_for_tree':
      state.imagePathForTree = action.content;
      break;
    case 'set_selected_files_for_dropzone':
      state.selectedFilesForDropZone = action.content;
      break;
    default:
      break;
  }
  return { ...state };
};

export default files;
