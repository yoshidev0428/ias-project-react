import { api } from "./base";
import store from '../reducers';
// API_URL,
// SET_IMAGE: `${API_URL}set-image`,
// CHANGE_IMAGE: `${API_URL}change-image`,
// COLOR_CHANNEL: `${API_URL}color-channel`,
// CHANGE_PARAMETER: `${API_URL}change-parameter`,
// GRAY: `${API_URL}gray`,
export const uploadExperimentData = params => {

    console.log(params)
    return api.post("/experiment/upload_experiment_data", params);
};

export const getImageTree = async () => {
    
    let response = await api.get("image/tile/get_image_tree")
    return response
}

export const deleteImageFiles = async (images) => {
    const state = store.getState();
    const formData = new FormData();
    formData.append("images", images)
    
    return api.post("image/tile/delete_image_files", formData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            "Content-Type": "application/json",
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    });
}

export const registerExperiment = async (expName, images) => {
    const state = store.getState();
    const formData = new FormData();
    formData.append("images", images)
    formData.append("expName", expName)

    return api.post("image/tile/register_experiment", formData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            "Content-Type": "application/json",
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    });
}

export const getExperimentData = async (expName) => {
    let response = await api.get("image/tile/get_experiment_data/" + expName)
    return response
}

export const getExperimentNames = async () => {
    let response = await api.get("image/tile/get_experiment_names")
    return response
}