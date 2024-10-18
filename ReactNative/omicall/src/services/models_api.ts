import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {authSelector} from '../presentation/redux/AuthReducer.ts';
import axiosService from './axios_service.ts';
import {Constants} from '../core/constants/Constants.ts';
import {ListPhoneModel} from '../models/ListPhoneModel.ts';
import {HistoryCallModel} from '../models/HistoryCallModel.ts';
import {ContactModel} from '../models/ContactModel.ts';
import {AddContactParam} from '../params/AddContactParam.ts';

const getAccessToken = async () => {
  const result = await AsyncStorage.getItem('auth');
  return result ? JSON.parse(result).token : useSelector(authSelector).token;
};

class ModelsApi {
  private HandleModels = async (
    url: string,
    method?: 'get' | 'post' | 'put' | 'delete',
    data?: any,
  ) => {
    return await axiosService(`/v1/models${url}`, {
      baseURL: Constants.baseURL,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      method: method ?? 'get',
      data,
    });
  };

  async getListPhone(): Promise<ListPhoneModel> {
    return ListPhoneModel.fromJson(
      await this.HandleModels('/CM_PhoneNumber', 'get'),
    );
  }

  async setDefaultPhone(phoneId: string, isDefault: boolean): Promise<void> {
    await this.HandleModels(`/CM_PhoneNumber/${phoneId}`, 'put', {
      isDefault: isDefault,
    });
  }

  async getHistoryCall(): Promise<HistoryCallModel> {
    return HistoryCallModel.fromJson(
      await this.HandleModels('/CM_Call', 'get'),
    );
  }

  async updateTagNoteCall(
    callID: number,
    Tag?: string,
    Note?: string,
  ): Promise<void> {
    await this.HandleModels(`/CM_Call/${callID}`, 'put', {
      Tag,
      Note,
    });
  }

  async getContact(): Promise<ContactModel> {
    return ContactModel.fromJson(
      await this.HandleModels('/CM_Customer', 'get'),
    );
  }

  async addContact(addContactParam: AddContactParam): Promise<void> {
    await this.HandleModels('/CM_Customer', 'post', addContactParam.toObject());
  }
}

const modelsAPI = new ModelsApi();
export default modelsAPI;
