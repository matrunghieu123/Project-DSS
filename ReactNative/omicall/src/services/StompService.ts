import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Constants} from '../core/constants/Constants.ts';
import {JoinChatRoomParam} from '../params/JoinChatRoomParam.ts';
import {SendMessageParam} from '../params/SendMessageParam.ts';
import {MessageModel} from '../models/MessageModel.ts';

class StompService {
  private client;
  private onMessageCallback: (message: MessageModel) => void = () => {};
  private connected: boolean = false;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(Constants.socketUrl),
      debug: (str: string) => console.log('STOMP Debug:', str),
      onConnect: () => {
        console.log('STOMP Connected');
        this.connected = true;

        this.client.subscribe('/chatroom/public', message => {
          const parsedMessage = JSON.parse(message.body);
          console.log('STOMP Message:', parsedMessage);
          this.onMessageCallback(parsedMessage);
        });
      },
      onStompError: frame => {
        console.log('STOMP Error:', frame.headers.message);
        this.connected = false;
      },
      onWebSocketClose: () => {
        console.log('STOMP Disconnected');
        this.connected = false;
      },
      reconnectDelay: 2000,
    });
  }

  public connect = () => {
    this.client.activate();
  };

  public disconnect = () => {
    this.client.deactivate();
  };

  public isConnected = () => {
    return this.connected;
  };

  public setOnMessageCallback = (callback: (message: MessageModel) => void) => {
    this.onMessageCallback = callback;
  };

  public joinChatRoom = (param: JoinChatRoomParam) => {
    if (this.isConnected()) {
      this.client.publish({destination: '/app/message', body: JSON.stringify(param)});
    } else {
      console.error('STOMP connection not established');
    }
  };

  public sendMessagePublic = (param: SendMessageParam) => {
    if (this.isConnected()) {
      this.client.publish({destination: '/app/message', body: JSON.stringify(param)});
    } else {
      console.error('STOMP connection not established');
    }
  };

  public sendMessagePrivate = (param: SendMessageParam) => {
    if (this.isConnected()) {
      this.client.publish({destination: '/app/private-message', body: JSON.stringify(param)});
    } else {
      console.error('STOMP connection not established');
    }
  };
}

export default new StompService();
