import * as API from "../../api";
import "./files";
const DEFAULT_PARAMS = {
  loading: false,
  loading_count: 0,
  loading_count_max: 0,
  image_num: 0,
  imageUri: [],
  imgwidth: 0,
  imgheight: 0,

  coreMetadata: null,
  originMetadata: null,
  imageId: -1,
  imageInfo: null,
  imageData: null,
  plateId: -1,
  wellId: -1,
  positionX: -1,
  positionY: -1,
  plates: [],
  wellSamples: [],

  allData: [],
  allDataMap: {},
  allIndice: [],
  allIndices: [],
  newRes: [],
  // newData: [],

  curPageIdx: -1,

  originData: null,
  parameters: {
    Z: 1,
    T: 1,
    C: 0,
    brightness: 0,
    contrast: 0,
    gamma: 100,
    objective: 4
  },
  isNew: false,
  flag_3d: false,
  flag_selroi: false,
  errorStatus: false,
  errorMessage:'',
  errorObj:[],
  roiPoints:{
    startX:0,
    startY:0,
    endX:0,
    endY:0
  }
};


const initState = {
    ...DEFAULT_PARAMS
  }

// actions
const image = (state = initState, action)  =>{
  switch (action.type) {
    case "image_setNewFiles":
      incLoadingCount(state);
      API.fileUpload(action.payload.formData)
      .then(response => {
        setImageUrl(state, response);
        return response;
      })
      .catch(error => {
        decLoadingCount(state, error);
      });
    default:
      return state
  }
};

// mutations
const incLoadingCount = (state) => {
  state.loading_count++;
  state.loading_count_max = state.loading_count;
  state.loading = true;
};
const setImageUrl = (state, response) => {
  state.image_num = response.data.N_images;
  state.imageUri = response;
  state.imgwidth = response.data.img_width;
  state.imgheight = response.data.img_height;
  state.flag_3d = response.data.Flag_3d;
  //state.flag_selroi = response.data.Flag_selroi;
  state.loading = false;
};
const decLoadingCount = (state, data) => {
  state.errorMessage = data;
  state.errorStatus = !state.errorStatus;
  state.errorObj = {'errorStatus':!state.errorStatus,
                    'errorMessage':state.errorMessage};
  state.loading_count--;
  if (state.loading_count === 0) {
    state.loading_count_max = state.loading_count;
  }
  state.loading = false;
};
export default image;