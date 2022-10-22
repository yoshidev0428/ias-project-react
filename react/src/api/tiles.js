import { api } from "./base";
import store from '../reducers';
import files from "../reducers/modules/files";

const state = store.getState();

export const uploadImageFiles = (files) => {
    const state = store.getState();
    const formData = new FormData();
    for (let i in files) {
        let f = files[i];
        formData.append("files", f);
    }

    return api.post("image/tile/upload_image_tiles", formData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            "Content-Type": "multipart/form-data",
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    });
};

export const uploadImages = (files, folderName) => {
    const state = store.getState();
    const formData = new FormData();
    for (let i in files) {
        let f = files[i];
        formData.append("files", f);
    }

    return api.post("image/tile/upload_images/" + folderName, formData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            "Content-Type": "multipart/form-data",
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    });
};

export const getImageByUrl = (imgName, callback) => {    
    const state = store.getState();
    fetch(process.env.REACT_APP_BASE_API_URL + "image/tile/get_image/" + imgName, {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        "Authorization": state.auth.tokenType + " " + state.auth.token,
    }
    })
    .then((response) => {
        return response.blob();
    })
    .then((blob)=>{
        let file = new File([blob], imgName, { type: "image/tiff" })
        file.path = imgName
        console.log(file)
        callback(null, file)
    })
    .catch(err => {
        callback(true)
    })
}

export const listTiles = (callback) => {
    api.get("image/tile/list")
        .then(function (response) {
            callback(response, true);
        })
        .catch(function (error) {
            callback(error, false);
        });
};

export const alignTilesApi = (rows, method, callback) => {

    const formData = new FormData();
    formData.append("method", method);
    formData.append("row", rows);
    api
        .get("image/tile/align_tiles_naive", formData, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            }
        })
        .then(function (response) {
            console.log("align success callback");
            if (callback) {
                callback(response, true);
            }
        })
        .catch(function (error) {
            console.log("align failed callback");
            if (callback) {
                callback(error, false);
            }
        });
};

export const updateNameFile = (params) => {
    // return api.post("/image/tile/update", params);
    return api.post("image/tile/update", params, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            "Content-Type": "multipart/form-data",
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    });
};

export const exportTiles = (success, fail) => {
    api
        .get("tiles/export/", { responseType: "blob" },
            {
                headers: {
                    Authorization: "Token " + sessionStorage.getItem("authToken")
                }
            })
        .then(response => {
            success(response);
        })
        .catch(function (error) {
            console.log(" -- export failed callback", error);
            if (fail) {
                fail(error);
            }
        });
};
