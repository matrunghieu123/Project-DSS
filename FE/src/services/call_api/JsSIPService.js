import { EventEmitter } from 'events';
import JsSIP from 'jssip';

class JsSIPService {
  constructor(extension, setRemoteStream) {
    this.coolPhone = null;
    this.setRemoteStream = setRemoteStream;
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(20);

    const socket = new JsSIP.WebSocketInterface(process.env.REACT_APP_SIP_SOCKET_URL);
    const configuration = {
      sockets: [socket],
      display_name: extension,
      uri: `sip:${extension}@${process.env.REACT_APP_SIP_SERVER}`,
      password: process.env.REACT_APP_SIP_PASSWORD,
    };

    this.coolPhone = new JsSIP.UA(configuration);
    this._registerPhoneEvents();
  }

  start() {
    this.coolPhone.start();  // Khởi động UA
  }

  _registerPhoneEvents() {
    this.coolPhone.on('connected', () => this.updateConnectionStatus('connected'));
    this.coolPhone.on('disconnected', () => this.updateConnectionStatus('disconnected'));
    this.coolPhone.on('registered', () => {
      this.updateConnectionStatus('registered');
      this.eventEmitter.emit('registered');  // Thêm dòng này
    });
    this.coolPhone.on('unregistered', () => this.updateConnectionStatus('unregistered'));
    this.coolPhone.on('registrationFailed', (e) => {
      console.error('Registration failed:', e);
      this.updateConnectionStatus('registrationFailed');
    });

    this.coolPhone.on('newRTCSession', (data) => this._handleNewRTCSession(data));
  }

  _handleNewRTCSession(data) {
    const session = data.session;

    session.on('connecting', () => this.updateConnectionStatus('connecting'));
    session.on('progress', () => this.updateConnectionStatus('progress'));
    session.on('accepted', () => this.updateConnectionStatus('accepted'));
    session.on('confirmed', () => this.updateConnectionStatus('confirmed'));
    session.on('ended', () => this.updateConnectionStatus('ended'));
    session.on('failed', (e) => this._handleSessionFailed(e));

    session.on('sdp', (e) => {
      e.sdp = this.filterSDP(e.sdp);
    });

    session.on('peerconnection', (e) => this._handlePeerConnection(e));
  }

  _handleSessionFailed(e) {
    console.error('Session failed:', e);
    const errorCode = e.message?.status_code || 0;
    if (errorCode === 607) {
      this.updateConnectionStatus('unwanted');
    } else {
      this.updateConnectionStatus('failed');
    }
  }

  _handlePeerConnection(e) {
    const peerconnection = e.peerconnection;
    peerconnection.getReceivers().forEach((receiver) => {
      const track = receiver.track;
      if (track) {
        this.setRemoteStream(new MediaStream([track]));
      }
    });
  }

  filterSDP(sdp) {
    return sdp
      .split('\r\n')
      .filter(line => !/^a=candidate:\d+ \d+ \w+ \d+ [0-9a-fA-F:]+ .*/.test(line))
      .join('\r\n');
  }

  updateConnectionStatus(status) {
    this.eventEmitter.emit('connectionStatusChanged', status);
  }

  disconnect() {
    if (this.coolPhone) {
      this.coolPhone.terminateSessions(); // Terminate ongoing sessions before stopping
      this.coolPhone.stop();
    }
  }

  makeCall(number) {
    const callOptions = {
      pcConfig: {
        rtcpMuxPolicy: 'negotiate',
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      },
      mediaConstraints: {
        audio: true,
        video: false,
      },
      sessionTimersExpires: 1800,
    };

    try {
      this.coolPhone.call(number, callOptions);
    } catch (error) {
      console.error('Error making call:', error);
    }
  }

  cancelCall() {
    if (this.coolPhone) {
      this.coolPhone.terminateSessions();
    }
  }

  onConnectionStatusChanged(listener) {
    this.eventEmitter.on('connectionStatusChanged', listener);
  }

  onRegister(listener) {
    this.eventEmitter.on('registered', listener); // Thêm phương thức này
  }
}

export default JsSIPService;
