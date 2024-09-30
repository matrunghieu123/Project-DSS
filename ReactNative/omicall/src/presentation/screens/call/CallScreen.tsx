import {View, StyleSheet, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback} from 'react-native';
import React, {FC} from 'react';
import {Styles} from '../../../core/constants/Styles.ts';
import {RowComponent} from '../../components';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomKeyboard from './CustomKeyboard.tsx';

const Header: FC<{navigation: any}> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.header}>
      <RowComponent style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name={'arrow-back-ios'}
            size={24}
            color={AppColors.white}
          />
        </TouchableOpacity>
        <View style={Styles.flex}>
          <Text style={styles.title}>Đầu số đang chọn</Text>
          <Text style={styles.number}>Không có đầu số khả dụng</Text>
        </View>
        <EditButton navigation={navigation} />
      </RowComponent>
    </SafeAreaView>
  );
};

const EditButton: FC<{navigation: any}> = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
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

const CallScreen: FC<{navigation: any}> = ({navigation}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={Styles.flex}>
        <View style={Styles.flex}>
          <Header navigation={navigation} />
          <Content />
        </View>
        <CustomKeyboard navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: AppColors.secondary,
    paddingHorizontal: 20,
    paddingBottom: -20, //TODO: fix for android
  },
  row: {
    alignItems: 'center',
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
