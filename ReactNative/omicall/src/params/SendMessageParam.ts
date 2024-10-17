import {Status} from '../core/constants/Status.ts';

export class SendMessageParam {
  public senderName: string;
  public receiverName?: string;
  public message: string;
  public status: Status;
  public fileUrl?: string;
  public fileType?: string;

  constructor(
    senderName: string,
    message: string,
    status: Status,
    receiverName?: string,
    fileUrl?: string,
    fileType?: string,
  ) {
    this.senderName = senderName;
    this.message = message;
    this.status = status;
    this.receiverName = receiverName;
    this.fileUrl = fileUrl;
    this.fileType = fileType;
  }
}
