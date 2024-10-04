import JsSIP from 'jssip';
import {Constants} from '../core/constants/Constants.ts';

class JsSIPService {
  private coolPhone;

  private constructor(extension: string) {
    const socket = new JsSIP.WebSocketInterface(Constants.socketUrlAlohub);
    const configuration = {
      sockets: [socket],
      display_name: extension, // optional
      uri: `sip:${extension}@crm.alohub.vn:55094`, // required
      password: Constants.passwordAlohub, // required
      /*session_timers: false*/
    };

    JsSIP.debug.enable('JsSIP:*');

    this.coolPhone = new JsSIP.UA(configuration);

    this.coolPhone.on('connected', function () {
      console.log('===connected===');
    });

    this.coolPhone.on('disconnected', function () {
      console.log('===disconnected===');
    });

    this.coolPhone.on('newMessage', function () {
      console.log('===newMessage===');
    });

    this.coolPhone.on('registered', function () {
      console.log('===registered===');
    });

    this.coolPhone.on('unregistered', function () {
      console.log('===unregistered===');
    });

    this.coolPhone.on('registrationFailed', function () {
      console.log('===registrationFailed===');
    });
  }

  public connect = () => {
    this.coolPhone.start();
  };

  public disconnect = () => {
    this.coolPhone.stop();
  };
}
