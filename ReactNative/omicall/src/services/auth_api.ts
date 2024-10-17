import axiosService from './axios_service.ts';
import {LoginModel} from '../models/LoginModel.ts';
import {Constants} from '../core/constants/Constants.ts';

class AuthApi {
  private HandleAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosService(`/v1${url}`, {
      baseURL: Constants.baseURL,
      headers: {
        Accept: 'application/json',
      },
      method: method ?? 'get',
      data,
    });
  };

  async login(email: string, password: string): Promise<LoginModel> {
    const data = {
      userName: email,
      password,
      parameters: {
        languageName: 'Việt Nam',
        languageCode: 'vi_VN',
      },
    };
    return LoginModel.fromJson(
      await this.HandleAuthentication('/token', data, 'post'),
    );
  }
}

const authenticationAPI = new AuthApi();
export default authenticationAPI;
