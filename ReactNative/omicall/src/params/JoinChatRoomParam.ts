import {Status} from '../core/constants/Status.ts';

export class JoinChatRoomParam {
  public senderName: string;
  public status: Status;
  constructor(name: string, status: Status) {
    this.senderName = name;
    this.status = status;
  }
}
