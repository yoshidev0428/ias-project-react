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
