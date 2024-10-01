import {Constants} from '../core/constants/Constants';
import axiosService from './axios_service.ts';

class ChatApi {
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
  HandleGetHistoryMessage = async (
    senderName: string,
    receiverName: string,
  ) => {
    return await axiosService(
      `/api/chat/history?senderName=${senderName}&receiverName=${receiverName}`,
      {
        baseURL: Constants.socketUrl,
        method: 'get',
      },
    );
  };
}

const chatAPI = new ChatApi();
export default chatAPI;
