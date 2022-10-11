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