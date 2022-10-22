
import { combineReducers, createStore } from "redux";
import auth from "./modules/auth";
import experiment from "./modules/experiment";
import files from "./modules/files";
import image from "./modules/image";
import vessel from "./modules/vessel"
import tiling from "./modules/tiling";

const reducer = combineReducers({
    auth: auth,
    experiment: experiment,
    files: files,
    image: image,
    vessel: vessel,
    tiling: tiling,
});

const store = createStore(reducer)
export default store;