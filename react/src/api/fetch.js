import store from '../reducers';

export const getImageByUrl = async function(imgName) {
    try {
        const state = store.getState();
        let response = await fetch("http://localhost:8000/image/tile/get_image/" + imgName, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "Authorization": state.auth.tokenType + " " + state.auth.token,
            }
        });
        let blob = await response.blob()
        let file = new File([blob], imgName, { type: "image/tiff" })
        file.path = imgName
        return file;
    } catch(err) {
        return null
    }
}

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



export const getMergedImage = async function(fileNames, newImageName, callback) {
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
    fetch("http://localhost:8000/image/tile/get_merged_image", options)
        .then(response => {
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