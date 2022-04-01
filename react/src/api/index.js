import { api } from "./base";

// API_URL,
// SET_IMAGE: `${API_URL}set-image`,
// CHANGE_IMAGE: `${API_URL}change-image`,
// COLOR_CHANNEL: `${API_URL}color-channel`,
// CHANGE_PARAMETER: `${API_URL}change-parameter`,
// GRAY: `${API_URL}gray`,

export const setImage = params => {
  return api.post("set-image", params);
};

export const fileUpload = params => {
  console.log(params)
  return api.post("/image/tile/upload_image_tiles", params);
};

export const setMetadata = params => {
  console.log(params)
  return api.post("/image/tile/upload_image_tiles", params);
};

export const deconvol2D = params => {
  console.log(params);
  return api.post("/image/tile/deconvol2D", params);
};

export const deconvol3D = params => {
  console.log(params);
  return api.post("/image/tile/deconvol3D", params);
};

export const sendImageFile_superresolution = params => {
  console.log(params);
  return api.post("/image/tile/SuperRes", params);
};

export const changeImage = params => {
  return api.post("change-image", params);
};

export const changeParameter = params => {
  return api.post("change-parameter", params);
};

export const adjustImage = params => {
  return api.post("adjust-image", params);
};
