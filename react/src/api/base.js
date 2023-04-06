import store from '../reducers';
import axios from 'axios';
var state = store.getState();

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const ilastikApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_ILASTIK_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((request) => {
  state = store.getState();
  if (state.auth.token) {
    request.headers['Authorization'] =
      state.auth.tokenType + ' ' + state.auth.token;
  }
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch({ type: 'auth_logOut' });
    }
    return Promise.reject(error);
  },
);
