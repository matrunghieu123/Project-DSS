import axios from 'axios';
import queryString from 'query-string';
import {Constants} from '../core/constants/Constants.ts';

const axiosService = axios.create({
  baseURL: Constants.baseURL,
  paramsSerializer: params => queryString.stringify(params),
});

axiosService.interceptors.request.use(async (config: any) => {
  config.headers = {
    Accept: 'application/json',
    ...config.headers,
  };
  config.data;
  return config;
});

axiosService.interceptors.response.use(
  response => {
    if (response.data && response.status === 200) {
      return response.data;
    }
    return Promise.reject({
      status: response.status,
      message: response.data.message,
    });
  },
  error => {
    let errorMessage = 'An error occurred';
    let status = 500;
    if (error.response) {
      errorMessage = error.response.data.message;
      status = error.response.status;
    }
    return Promise.reject({
      status: status,
      message: errorMessage,
    });
  },
);

export default axiosService;
