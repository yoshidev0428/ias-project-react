import { api } from './base';
import store from '../reducers';
// API_URL,
// SET_IMAGE: `${API_URL}set-image`,
// CHANGE_IMAGE: `${API_URL}change-image`,
// COLOR_CHANNEL: `${API_URL}color-channel`,
// CHANGE_PARAMETER: `${API_URL}change-parameter`,
// GRAY: `${API_URL}gray`,
export const uploadExperimentData = (params) => {
  return api.post('/experiment/upload_experiment_data', params);
};

export const getImageTree = async () => {
  let response = await api.get('image/tile/get_image_tree');
  return response;
};

export const deleteImageFiles = async (images) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('images', images);

  return api.post('image/tile/delete_image_files', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'application/json',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

// added by Wang
export const registerExperiment = async (experiment_name, images) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('images', images);
  formData.append('experiment_name', experiment_name);
  return api.post('image/tile/register_experiment', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};
export const setExperiment = async (
  experimentName,
  addFolderName,
  addedFiles,
) => {
  const state = store.getState();
  const formData = new FormData();
  // formData.append("images", addedFiles);
  formData.append('experiment_name', experimentName);
  for (let i in addedFiles) {
    let f = addedFiles[i];
    formData.append('files', f);
  }
  formData.append('folderName', addFolderName);
  return api.post('image/tile/set_experiment', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const setExperiment_file = async (experimentName, addedFiles) => {
  const state = store.getState();
  const formData = new FormData();
  // formData.append("images", addedFiles);
  formData.append('experiment_name', experimentName);
  for (let i in addedFiles) {
    let f = addedFiles[i];
    formData.append('files', f);
  }
  return api.post('image/tile/set_experiment_with_files', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const setExperiment_folder = async (experimentName, addedFiles) => {
  const state = store.getState();
  const formData = new FormData();
  let pathArray = [];
  formData.append('experiment_name', experimentName);
  for (let i in addedFiles) {
    let f = addedFiles[i];
    formData.append('files', f);
    pathArray.push(f.path);
  }
  formData.append('path', pathArray);
  return api.post('image/tile/set_experiment_with_folders', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};
export const registerExperimentName = async (experiment_name) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('experiment_name', experiment_name);
  return api.post('image/tile/register_experiment_name', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const getExperimentData = async (experiment_name) => {
  let response = await api.get(
    'image/tile/get_experiment_data/' + experiment_name,
  );
  return response;
};

export const getExperimentNames = async () => {
  let response = await api.get('image/tile/get_experiment_names');
  return response;
};

export const getExperimentDatas = async () => {
  // const state = store.getState();
  let response = await api.get('image/tile/get_experiments_datas');
  return response;
  // let response = await api.get("image/tile/get_experiment_names")
  // return response
};

export const getMetaData = async () => {
  let response = await api.get('image/tile/get_meta_datas');
  return response;
};

export const testSegment = async (file_url, exp_name, model_name) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('file_url', file_url);
  formData.append('exp_url', exp_name);
  formData.append('model_name', model_name);
  return api.post('image/tile/test_segment', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const save_model = async (model_info) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('custom_method', model_info.custom_method);
  formData.append('custom_name', model_info.custom_name);
  formData.append('custom_icon', model_info.custom_icon);
  formData.append('viewValue', model_info.viewValue);
  formData.append('outline', model_info.outline);
  formData.append('cell_diam', model_info.cell_diam);
  formData.append('chan_segment', model_info.chan_segment);
  formData.append('chan_2', model_info.chan_2);
  formData.append('f_threshold', model_info.f_threshold);
  formData.append('c_threshold', model_info.c_threshold);
  formData.append('s_threshold', model_info.s_threshold);
  return api.post('image/tile/save_model', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const get_model = async () => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('model', 'experiment_name');
  return api.post('image/tile/get_models', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

export const get_outlines = async (file_url, exp_name) => {
  const state = store.getState();
  const formData = new FormData();
  formData.append('file_url', file_url);
  formData.append('exp_url', exp_name);
  return api.post('image/tile/get_outlines', formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'multipart/form-data',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  });
};

/**
 * @author QmQ
 * @description send the image and receive the processed image using Machine Learning method.
 *
 */

export const MLGetProcessedImage = async (file_url, exp_name, setting) => {
  const formData = new FormData();
  formData.append('file_url', file_url);
  formData.append('ext_url', exp_name);
  // console.log('============> ML get processed image', file_url, exp_name)
  return api.post('image/tile/ml_get_processe_image', formData);
};
