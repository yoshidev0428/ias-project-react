import axios from "axios";
import store from '../reducers'
const state = store.getState();
// export const BASE_API_URL = "http://localhost:8000/";
export const BASE_API_URL = "http://20.89.99.224:8000/";
export const api = axios.create({
  baseURL: BASE_API_URL,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      "Content-Type": "application/json"
    }
});

api.interceptors.request.use(request => {
  console.log("[API Request]", request);

  /* add auth headers */
  if (state.auth.token) {
    request.headers["Authorization"] =
      state.auth.tokenType + " " + state.auth.token;
    request.headers["Content-Type"] = "application/json";
  }
  // if (sessionStorage.getItem("authToken")) {
  //   request.headers["Authorization"] =
  //     sessionStorage.getItem("authTokenType") +
  //     " " +
  //     sessionStorage.getItem("authToken");
  //   request.headers["Content-Type"] = "application/json";
  // }

  return request;
});

api.interceptors.response.use(
  response => {
    console.log("[API Response]", response);
    return response;
  },
  error => {
    console.log("[API ERROR]", error);
    store.dispatch({ type: 'auth_logOut'});
    if (error?.response?.status === 401) {
      store.dispatch({ type: 'auth_logOut'});
    }
    return Promise.reject(error);
  }
);
