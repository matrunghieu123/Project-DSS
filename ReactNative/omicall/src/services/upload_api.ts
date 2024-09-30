import {Constants} from '../core/constants/Constants';
import axiosService from './axios_service.ts';

class UploadApi {
  HandleUpload = async (
    senderName: string,
    receiverName: string,
    message: string,
    file: any,
  ) => {
    const formData = new FormData();
    formData.append('senderName', senderName);
    formData.append('receiverName', receiverName);
    formData.append('message', message);
    formData.append('file', file);

    return await axiosService('/api/upload', {
      baseURL: Constants.socketUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'post',
      data: formData,
    });
  };
}

const uploadAPI = new UploadApi();
export default uploadAPI;
