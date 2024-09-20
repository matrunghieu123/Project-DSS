import axiosService from './AxiosService.ts';
import {LoginModel} from '../models/LoginModel.ts';

class AuthAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return LoginModel.fromJson(
      await axiosService(`/v1${url}`, {
        method: method ?? 'get',
        data,
      }),
    );
  };
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
