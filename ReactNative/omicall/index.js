import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {TextEncoder} from 'text-encoding';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';

global.TextEncoder = TextEncoder;
global.RTCPeerConnection = global.RTCPeerConnection || RTCPeerConnection;
global.RTCIceCandidate = global.RTCIceCandidate || RTCIceCandidate;
global.RTCSessionDescription = global.RTCSessionDescription || RTCSessionDescription;
global.MediaStream = global.MediaStream || MediaStream;
global.MediaStreamTrack = global.MediaStreamTrack || MediaStreamTrack;
global.navigator.mediaDevices = global.navigator.mediaDevices || mediaDevices;
global.navigator.getUserMedia = global.navigator.getUserMedia || mediaDevices.getUserMedia;

AppRegistry.registerComponent(appName, () => App);
