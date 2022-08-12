import { api } from "./base";

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

export const getExperimentData = params => {
    return api.post("/experiment/get_experiment_data");
}
