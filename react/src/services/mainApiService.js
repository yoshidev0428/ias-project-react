import axios from 'axios';
import store from '@/reducers';

const mainApiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
});

mainApiService.interceptors.request.use((config) => {
  const { tokenType, token } = store.getState().auth;
  if (tokenType && token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }
  return config;
});

mainApiService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch({ type: 'auth_logOut' });
    }
    return Promise.reject(error);
  },
);

export default mainApiService;
