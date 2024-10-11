import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Styles} from '../../../core/constants/Styles.ts';
import {RowComponent} from '../../components';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomKeyboard from './CustomKeyboard.tsx';
import JsSIPService from '../../../services/jsSIP_service.ts';
import {MediaStream} from 'react-native-webrtc';
import {Constants} from '../../../core/constants/Constants.ts';
import LoadingModal from '../../modal/LoadingModal.tsx';
import authenticationAPI from '../../../services/auth_api.ts';
import {ListPhoneModel} from '../../../models/ListPhoneModel.ts';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetListPhone from './BottomSheetListPhone.tsx';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const CallScreen: FC<{navigation: any}> = ({navigation}) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [jsSIPService, setJsSIPService] = useState<JsSIPService | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listPhone, setListPhone] = useState<ListPhoneModel | null>(null);
  const [phoneChoose, setPhoneChoose] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await authenticationAPI.HandleListPhone();
        setListPhone(response);
        response.records.find(item => {
          if (item.IsDefault) {
            setPhoneChoose(`${item.Value} - ${item.Name}`);
          }
        });
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(error => console.log('Error: ', error));
  }, [phoneChoose]);

  useEffect(() => {
    const jsSIPService = new JsSIPService(Constants.extensionAlohub, stream =>
      setRemoteStream(stream),
    );
    setJsSIPService(jsSIPService);
  }, []);

  return (
    <GestureHandlerRootView style={Styles.flex}>
      <LoadingModal visible={isLoading} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={Styles.flex}>
          <StatusBar
            backgroundColor={AppColors.secondary}
            barStyle="light-content"
          />
          <View style={{flex: 5}}>
            <Header
              navigation={navigation}
              bottomSheetRef={bottomSheetRef}
              jsSIPService={jsSIPService!}
              phoneChoose={phoneChoose}
            />
            <Content />
          </View>
          <CustomKeyboard
            navigation={navigation}
            jsSIPService={jsSIPService!}
            remoteStream={remoteStream!}
            phoneNumber={phoneChoose}
          />
          <BottomSheetListPhone
            bottomSheetRef={bottomSheetRef}
            listPhone={listPhone!}
            setPhoneChoose={setPhoneChoose}
          />
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const Header: FC<{
  navigation: any;
  bottomSheetRef: any;
  jsSIPService: JsSIPService;
  phoneChoose: string;
}> = ({navigation, bottomSheetRef, jsSIPService, phoneChoose}) => {
  const handleCallPress = () => {
    jsSIPService.disconnect();
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.header}>
      <RowComponent style={styles.row}>
        <TouchableOpacity onPress={handleCallPress}>
          <MaterialIcons
            name={'arrow-back-ios'}
            size={24}
            color={AppColors.white}
          />
        </TouchableOpacity>
        <View style={Styles.flex}>
          <Text style={styles.title}>Đầu số đang chọn</Text>
          <Text style={styles.number}>
            {phoneChoose ? phoneChoose : 'Không có đầu số khả dụng'}
          </Text>
        </View>
        <EditButton bottomSheetRef={bottomSheetRef} />
      </RowComponent>
    </SafeAreaView>
  );
};

const EditButton: FC<{bottomSheetRef: any}> = ({bottomSheetRef}) => {
  return (
    <TouchableOpacity onPress={() => bottomSheetRef.current.expand()}>
      <View style={[styles.editContainer, Styles.center]}>
        <View style={styles.editBackground} />
        <FontAwesome5 name="pen" size={20} color={AppColors.white} />
      </View>
    </TouchableOpacity>
  );
};

const Content: FC = () => {
  return (
    <View style={Styles.flex}>
      <Text style={styles.text}>Cuộc gọi gần nhất</Text>
      <Text style={[styles.text, styles.notHaveData]}>Chưa có dữ liệu</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: AppColors.secondary,
  },
  row: {
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingBottom: '3%',
  },
  title: {
    fontFamily: Fonts.regular,
    color: AppColors.greyIcon,
  },
  number: {
    fontFamily: Fonts.medium,
    color: AppColors.white,
    fontSize: 16,
    marginTop: 5,
  },
  editContainer: {
    width: 45,
    height: 45,
  },
  editBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderRadius: 15,
    opacity: 0.1,
  },
  text: {
    fontFamily: Fonts.regular,
    color: AppColors.greyIcon,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 5,
  },
  notHaveData: {
    textAlign: 'center',
  },
});
export default CallScreen;
