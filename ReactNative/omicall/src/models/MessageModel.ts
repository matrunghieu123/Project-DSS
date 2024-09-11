import {Status} from '../core/constants/Status.ts';

export class MessageModel {
  public senderName: string;
  public receiverName?: string;
  public message: string;
  public status: Status;

  constructor(
    senderName: string,
    message: string,
    status: Status,
    receiverName?: string,
  ) {
    this.senderName = senderName;
    this.message = message;
    this.status = status;
    this.receiverName = receiverName;
  }
}
