const DEFAULT_PARAMS = {
  isFilesAvailable: false,
  files: null,
};

const initState = {
  ...DEFAULT_PARAMS,
}

//action redux
const files = (state = initState, action)  =>{
  switch (action.type) {
    case "files_addFiles":
      state.files = action.files;
      state.isFilesAvailable = true;
      break
    case "files_removeAllFiles":
      state.files = null;
      state.isFilesAvailable = false; 
    default:
      break;
  }
  return {...state}
};

export default files;