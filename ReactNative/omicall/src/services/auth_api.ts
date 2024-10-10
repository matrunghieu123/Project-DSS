import axiosService from './axios_service.ts';
import {LoginModel} from '../models/LoginModel.ts';
import {Constants} from '../core/constants/Constants.ts';
import {authSelector} from '../presentation/redux/AuthReducer.ts';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListPhoneModel} from '../models/ListPhoneModel.ts';

const getAccessToken = async () => {
  const result = await AsyncStorage.getItem('auth');
  return result ? JSON.parse(result).token : useSelector(authSelector).token;
};

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
  HandleListPhone = async (
    method?: 'get' | 'post' | 'put' | 'delete',
    id?: string,
    data?: any,
  ) => {
    return ListPhoneModel.fromJson(
      await axiosService(`/v1/models/CM_PhoneNumber${id ? `/${id}` : ''}`, {
        baseURL: Constants.baseURL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        method: method ?? 'get',
        data,
      }),
    );
  };
}

const authenticationAPI = new AuthApi();
export default authenticationAPI;
