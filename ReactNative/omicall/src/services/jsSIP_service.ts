import {EventEmitter} from 'events';
import {MediaStream} from 'react-native-webrtc';
import {Constants} from '../core/constants/Constants.ts';
import JsSIP from 'jssip';
import {RTCSession} from 'jssip/lib/RTCSession';

class JsSIPService {
  private coolPhone: JsSIP.UA;
  private readonly setRemoteStream: (stream: MediaStream) => void;
  private eventEmitter: EventEmitter;

  constructor(
    extension: string,
    setRemoteStream: (stream: MediaStream) => void,
  ) {
    this.setRemoteStream = setRemoteStream;
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(20);
    const socket = new JsSIP.WebSocketInterface(Constants.socketUrlAlohub);
    const configuration = {
      sockets: [socket],
      display_name: extension,
      uri: `sip:${extension}@${Constants.sipUrlAlohub}`,
      password: Constants.passwordAlohub,
    };
    this.coolPhone = new JsSIP.UA(configuration);

    this.coolPhone.on('connected', () => {
      console.log('connected');
      this.updateConnectionStatus('connected');
    });

    this.coolPhone.on('disconnected', () => {
      console.log('disconnected');
      this.updateConnectionStatus('disconnected');
    });

    this.coolPhone.on('registered', () => {
      console.log('registered');
      this.updateConnectionStatus('registered');
    });

    this.coolPhone.on('unregistered', () => {
      console.log('unregistered');
      this.updateConnectionStatus('unregistered');
    });

    this.coolPhone.on('registrationFailed', () => {
      console.log('registrationFailed');
      this.updateConnectionStatus('registrationFailed');
    });

    this.coolPhone.on(
      'newRTCSession',
      (data: {originator: string; session: RTCSession}) => {
        const session = data.session;

        session.on('connecting', () => {
          console.log('connecting');
          this.updateConnectionStatus('connecting');
        });

        session.on('progress', () => {
          console.log('progress');
          this.updateConnectionStatus('progress');
        });

        session.on('accepted', () => {
          console.log('accepted');
          this.updateConnectionStatus('accepted');
        });

        session.on('confirmed', () => {
          console.log('confirmed');
          this.updateConnectionStatus('confirmed');
        });

        session.on('ended', () => {
          console.log('ended');
          this.updateConnectionStatus('ended');
        });

        session.on('failed', (e: any) => {
          console.log('failed');
          const errorCode = e.message?.status_code || 0;
          switch (errorCode) {
            case 607:
              this.updateConnectionStatus('unwanted');
              break;
            default:
              this.updateConnectionStatus('failed');
          }
        });

        session.on('sdp', (e: any) => {
          e.sdp = this.filterSDP(e.sdp);
        });

        session.on('peerconnection', (e: any) => {
          const peerconnection = e.peerconnection;

          peerconnection.getReceivers().forEach((receiver: any) => {
            const track = receiver.track;
            if (track) {
              this.setRemoteStream(new MediaStream([track]));
            }
          });
        });
      },
    );

    this.coolPhone.start();
  }

  private filterSDP = (sdp: string) => {
    return sdp
      .split('\r\n')
      .filter(line => {
        return !/^a=candidate:\d+ \d+ \w+ \d+ [0-9a-fA-F:]+ .*/.test(line);
      })
      .join('\r\n');
  };

  private updateConnectionStatus(status: string) {
    this.eventEmitter.emit('connectionStatusChanged', status);
  }

  public disconnect = () => {
    this.coolPhone.stop();
  };

  public makeCall = (number: string) => {
    const callOptions = {
      pcConfig: {
        rtcpMuxPolicy: 'negotiate',
        iceServers: [{urls: ['stun:stun.l.google.com:19302']}],
      },
      mediaConstraints: {
        audio: true,
        video: false,
      },
      sessionTimersExpires: 1800,
    };
    this.coolPhone.call(number, callOptions);
  };

  public cancelCall = () => {
    this.coolPhone.terminateSessions();
  };

  public onConnectionStatusChanged = (listener: (status: string) => void) => {
    this.eventEmitter.on('connectionStatusChanged', listener);
  };
}

export default JsSIPService;
