import {Status} from '../core/constants/Status.ts';

export class MessageModel {
  public chatID: string;
  public message_id: string;
  public senderName: string;
  public receiverName?: string;
  public message?: string;
  public status: Status;
  public time: string;
  public fileUrl?: string;
  public fileType?: string;

  constructor(
    chatID: string,
    message_id: string,
    senderName: string,
    message: string,
    status: Status,
    time: string,
    receiverName?: string,
    fileUrl?: string,
    fileType?: string,
  ) {
    this.chatID = chatID;
    this.message_id = message_id;
    this.senderName = senderName;
    this.message = message;
    this.status = status;
    this.time = time;
    this.receiverName = receiverName;
    this.fileUrl = fileUrl;
    this.fileType = fileType;
  }
}
