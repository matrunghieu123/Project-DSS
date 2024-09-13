import {Status} from '../core/constants/Status.ts';

export class MessageModel {
  public chatID: string;
  public senderName: string;
  public receiverName?: string;
  public message?: string;
  public status: Status;
  public time: string;
  public fileUrl?: string;

  constructor(
    chatID: string,
    senderName: string,
    message: string,
    status: Status,
    time: string,
    receiverName?: string,
    fileUrl?: string,
  ) {
    this.chatID = chatID;
    this.senderName = senderName;
    this.message = message;
    this.status = status;
    this.time = time;
    this.receiverName = receiverName;
    this.fileUrl = fileUrl;
  }
}
