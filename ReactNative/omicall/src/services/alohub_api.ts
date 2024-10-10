import axiosService from './axios_service.ts';
import {Constants} from '../core/constants/Constants.ts';

class AlohubApi {
  HandleSetPhoneNumber = async (
    userName: string,
    calloutId: string,
    lstExtension: string[],
  ) => {
    return await axiosService(
      `/api/setting/agent/updateQueue?userName=${userName}`,
      {
        baseURL: Constants.baseUrlAlohub,
        headers: {
          Accept: 'application/json',
          Authorization: Constants.apikeyAlohub,
        },
        data: {
          action: 'EDIT',
          calloutId,
          lstExtension,
        },
        method: 'post',
      },
    );
  };
}

const alohubAPI = new AlohubApi();
export default alohubAPI;
