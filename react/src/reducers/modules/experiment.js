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
    timeline: null,
  },
  metadatas: [],
  method: 'tissuenet',
  MLMethod: 'pc',
  MLMethodList: [],
  MLObjectBrightnessMode: 'light',
  MLSelectTargetMode: 'object',
  MLObjectLabelPosInfo: [],
  MLBackgroundLabelPosInfo: [],
  custom_name: 'New Model',
  seg_info: {
    custom_method: 'tissuenet',
    custom_name: 'New Model',
    custom_icon: 'tissuenet',
    viewValue: 'image',
    outline: 0,
    cell_diam: 0,
    chan_segment: 0,
    chan_2: 0,
    f_threshold: 0,
    c_threshold: 0,
    s_threshold: 0,
  },
  train_info: {
    init_model: '',
    model_name: '',
    segment: 0,
    chan2: 0,
    learning_rate: 0.1,
    weight_decay: 0.0001,
    n_epochs: 100,
  },
  models: [],
  current_model: null,
  canvas_info: {
    outlines: [],
    draw_style: '',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    zoom: 1,
  },
};

const initState = {
  ...DEFAULT_PARAMS,
};

const experiment = (state = initState, action) => {
  switch (action.type) {
    case 'set_experiment_data':
      state.experiments = action.content;
      break;
    case 'setMetaInfo':
      state.metainfo = action.content;
      break;
    case 'setMethod':
      state.method = action.content;
      break;

    // ================ ML part <start>====================== ** QmQ
    case 'setMLMethod':
      state.MLMethod = action.content;
      break;
    case 'addMLMethod':
      const _content = action.content;
      state.MLMethodList = [...state.MLMethodList, _content];
      break;
    case 'deleteMLMethod':
      state.MLMethodList = state.MLMethodList.filter(
        (mth) => mth.name !== action.content.name,
      );
      break;
    case 'setMLObjectBrightnessMode':
      state.MLObjectBrightnessMode = action.content;
      break;
    case 'setMLSelectTargetMode':
      state.MLSelectTargetMode = action.content;
      break;
    case 'setMLObjectLabelPosInfo':
      let tempOb = state.MLObjectLabelPosInfo;
      state.MLObjectLabelPosInfo = tempOb;
      tempOb.push(action.content);

      // state.MLObjectLabelPosInfo = [
      //   ...state.MLObjectLabelPosInfo,
      //   ...action.content,
      // ];
      break;
    case 'setMLBackgroundLabelPosInfo':
      let tempBg = state.MLBackgroundLabelPosInfo;
      state.MLBackgroundLabelPosInfo = tempBg;
      tempBg.push(action.content);

      // state.MLBackgroundLabelPosInfo = [
      //   ...state.MLBackgroundLabelPosInfo,
      //   ...action.content,
      // ];
      break;
    case 'clearMLObjectLabelPosInfo':
      state.MLObjectLabelPosInfo = [];
      break;
    case 'clearMLBackgroundLabelPosInfo':
      state.MLBackgroundLabelPosInfo = [];
      break;
    // ================ ML part <end>======================== ** QmQ

    case 'set_custom_name':
      state.custom_name = action.content;
      break;
    case 'set_seg_info':
      state.seg_info = action.content;
      break;
    case 'set_models':
      state.models = action.content;
      break;
    case 'set_canvas':
      state.canvas_info = action.content;
      break;
    case 'set_current_model':
      state.current_model = action.content;
      break;
    case 'set_train_info':
      state.train_info = action.content;
      break;
    default:
      break;
  }
  return { ...state };
};

export default experiment;
