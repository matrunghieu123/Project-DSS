import axiosService from './axios_service.ts';
import {LoginModel} from '../models/LoginModel.ts';
import {Constants} from '../core/constants/Constants.ts';

class AuthApi {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return LoginModel.fromJson(
      await axiosService(`/v1${url}`, {
        baseURL: Constants.baseURL,
        headers: {
          Accept: 'application/json',
        },
        method: method ?? 'get',
        data,
      }),
    );
  };
}

const authenticationAPI = new AuthApi();
export default authenticationAPI;
