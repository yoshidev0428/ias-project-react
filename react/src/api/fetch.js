import store from '../reducers';

const makeFormBody = (details) => {
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
}

export const getImageByUrl = async function(imgName) {
    try {
        const state = store.getState();
        let response = await fetch(process.env.REACT_APP_BASE_API_URL + "image/tile/get_image/" + imgName, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "Authorization": state.auth.tokenType + " " + state.auth.token,
            }
        });
        let blob = await response.blob();
        let file = new File([blob], imgName, {type: "image/tiff"});
        file.path = imgName;
        return file;
    } catch (err) {
        console.log(" api/fetch getImageByUrl : error = ", err);
        return null
    }
}

export const getImagesByNames = async function(imgNames) {
    const state = store.getState();
    try {
        const files = []
        let imgName = imgNames[0]
        const promises = imgNames.map(async (imgName) => {
            const params = {
                "merge_req_body": imgName
            };
            const options = {
                method: 'POST',
                body: makeFormBody(params),
                mode: "cors",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    "Authorization": state.auth.tokenType + " " + state.auth.token,
                }
            };
            let response = await fetch(process.env.REACT_APP_BASE_API_URL + "image/tile/get_image_by_path", options)
            let blob = await response.blob()
            var filename = imgName.substring(imgName.lastIndexOf('/') + 1);

            let file = new File([blob], filename, { type: "image/tiff" })
            file.path = filename
            return file
        })
        return Promise.all(promises);
    } catch(err) {
        return null
    }
}

export const getMergedImage = async function(fileNames, newImageName, callback) {
    console.log("fetch.js->getMergedImage: fileNames =", fileNames, ", newImageName =", newImageName);
    const state = store.getState();
    const params = {
        "merge_req_body": fileNames.join(",") + '&' + newImageName
    };
    const options = {
        method: 'POST',
        body: makeFormBody(params),
        mode: "cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "Authorization": state.auth.tokenType + " " + state.auth.token,
        }
    };
    console.log("fetch.js->getMergedImage: options = ", options);

    fetch(process.env.REACT_APP_BASE_API_URL + "image/tile/get_merged_image", options)
        .then(response => {
            console.log("fetch.js->getMergedImage: response = ", response);
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(data => {
                    if(data.error) {
                        alert(data.error)
                    }
                    callback(true)
                });
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            let file = new File([blob], newImageName, { type: "image/tiff" })
            file.path = newImageName
            callback(null, file)
        })
        .catch(err => callback(true))
}

