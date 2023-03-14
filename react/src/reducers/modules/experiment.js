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
    custom_name: 'New Model',
    seg_info: {
      custom_method: 'tissuenet',
      custom_name: 'New Model',
      custom_icon: 'tissuenet',
      viewValue: 'image',
      outline: false,
      cell_diam: 0,
      chan_segment: 0,
      chan_2: 0,
      f_threshold: 0,
      c_threshold: 0,
      s_threshold: 0,
    },
    models: [],
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
      case 'set_custom_name':
        state.custom_name = action.content;
        break;
      case 'set_seg_info':
        state.seg_info = action.content;
        break;
      case 'set_models':
        state.models = action.content;
        break;
      default:
        break;
    }
    return { ...state };
  };
  
  export default experiment;
  