import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import JsSIPService from '../../services/jsSIP_service';
import {Styles} from '../../core/constants/Styles.ts';
import {AppColors} from '../../core/constants/AppColors.ts';
import CallOutIcon from '../../../assets/svg/CallOutIcon.tsx';
import {
  AvatarCircle,
  ButtonSquare,
  RowComponent,
  SpaceComponent,
} from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Fonts} from '../../core/constants/Fonts.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  isCalling: boolean;
  setIsCalling: (value: boolean) => void;
  remoteStream: MediaStream;
  jsSIPService: JsSIPService;
  numberCallOut: string;
  numberCallIn: string;
}

const ModalCallingScreen = (props: Props) => {
  const {
    isCalling,
    setIsCalling,
    remoteStream,
    jsSIPService,
    numberCallOut,
    numberCallIn,
  } = props;

  const [connectionStatus, setConnectionStatus] = useState('');
  const [time, setTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);
  let timer: NodeJS.Timeout;

  const handleCallEnd = () => {
    setIsCalling(false);
    jsSIPService.cancelCall();

    InCallManager.setSpeakerphoneOn(false);
    InCallManager.stopProximitySensor();
    InCallManager.stop();
  };

  const toggleSpeaker = () => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    InCallManager.setSpeakerphoneOn(newSpeakerState);
    isSpeakerOn
      ? InCallManager.startProximitySensor()
      : InCallManager.stopProximitySensor();
  };

  const toggleMute = () => {
    const newMuteState = !isMute;
    setIsMute(newMuteState);
    InCallManager.setMicrophoneMute(newMuteState);
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (isCalling) {
      jsSIPService.makeCall(numberCallOut);
      setTime(Date.now());
      InCallManager.start({media: 'audio'});
      InCallManager.startProximitySensor();
    }
  }, [isCalling]);

  useEffect(() => {
    const updateConnectionStatus = (status: string) => {
      switch (status) {
        case 'connecting':
          setConnectionStatus('Đang kết nối...');
          break;
        case 'progress':
          setConnectionStatus('Đang đổ chuông...');
          break;
        case 'connected':
          setConnectionStatus('Đã kết nối');
          break;
        case 'ended':
          setConnectionStatus('Kết thúc cuộc gọi');
          setTimeout(() => setIsCalling(false), 5000);
          break;
        case 'failed':
          setConnectionStatus('Cuộc gọi thất bại');
          setTimeout(() => setIsCalling(false), 5000);
          break;
        case 'unwanted':
          setConnectionStatus('Khách hàng đăng ký không nhận cuộc gọi này');
          setTimeout(() => setIsCalling(false), 5000);
          break;
        default:
          setConnectionStatus(status);
      }
    };

    jsSIPService.onConnectionStatusChanged(updateConnectionStatus);

    return () => {
      jsSIPService.onConnectionStatusChanged(() => {});
    };
  }, [jsSIPService]);

  useEffect(() => {
    if (connectionStatus === 'confirmed') {
      timer = setInterval(() => {
        setCallDuration(prevDuration => prevDuration + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [connectionStatus]);

  return (
    <Modal visible={isCalling}>
      <SafeAreaView
        style={[Styles.flex, {backgroundColor: AppColors.secondary}]}>
        {remoteStream && <RTCView streamURL={remoteStream.toURL()} />}
        <RowComponent style={styles.row}>
          <RowComponent>
            <CallOutIcon />
            <Text style={styles.callIn}>{numberCallIn}</Text>
          </RowComponent>
          <Text style={styles.callOut}>
            Cuộc gọi đi{' '}
            {new Date(time).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </RowComponent>
        <View style={{flex: 1, alignItems: 'center'}}>
          <SpaceComponent height={50} />
          <AvatarCircle style={{width: 80, height: 80}} />
          <Text style={styles.name}>Không xác định</Text>
          <Text style={styles.callOut}>{numberCallOut}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <FunctionComponent
            toggleSpeaker={toggleSpeaker}
            isSpeakerOn={isSpeakerOn}
            toggleMute={toggleMute}
            isMute={isMute}
          />
          <Text style={styles.status}>
            {connectionStatus !== 'confirmed'
              ? connectionStatus
              : formatDuration(callDuration)}
          </Text>
          <SpaceComponent height={50} />
          <TouchableOpacity style={styles.callEnd} onPress={handleCallEnd}>
            <MaterialIcons name="call-end" size={40} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const FunctionComponent = ({
  toggleSpeaker,
  isSpeakerOn,
  toggleMute,
  isMute,
}: {
  toggleSpeaker: () => void;
  isSpeakerOn: boolean;
  toggleMute: () => void;
  isMute: boolean;
}) => {
  return (
    <RowComponent style={{width: '90%', justifyContent: 'space-evenly'}}>
      <ButtonSquare
        width={60}
        height={60}
        icon={
          <MaterialIcons name="add-call" size={26} color={AppColors.white} />
        }
        backgroundColor="white"
      />
      <ButtonSquare
        width={60}
        height={60}
        icon={<Ionicons name="pause" size={26} color={AppColors.white} />}
        backgroundColor="white"
      />
      <ButtonSquare
        width={60}
        height={60}
        icon={<Ionicons name="keypad" size={26} color={AppColors.white} />}
        backgroundColor="white"
      />
      <ButtonSquare
        width={60}
        height={60}
        icon={
          <FontAwesome
            name={isMute ? 'microphone-slash' : 'microphone'}
            size={26}
            color={AppColors.white}
          />
        }
        backgroundColor="white"
        onPress={toggleMute}
      />
      <ButtonSquare
        width={60}
        height={60}
        icon={
          <FontAwesome
            name={isSpeakerOn ? 'volume-down' : 'volume-up'}
            size={26}
            color={AppColors.white}
          />
        }
        backgroundColor="white"
        onPress={toggleSpeaker}
      />
    </RowComponent>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callIn: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: AppColors.white,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: AppColors.white,
    marginTop: 20,
    marginBottom: 5,
  },
  callOut: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: AppColors.white,
  },
  status: {
    fontSize: 26,
    fontFamily: Fonts.regular,
    color: AppColors.white,
    textAlign: 'center',
    padding: 20,
  },
  callEnd: {
    backgroundColor: AppColors.red,
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalCallingScreen;
