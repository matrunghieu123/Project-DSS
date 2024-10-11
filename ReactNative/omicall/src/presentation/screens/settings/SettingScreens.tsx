import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Styles} from '../../../core/constants/Styles.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ButtonComponent} from '../../components';
import {useDispatch} from 'react-redux';
import {removeAuth} from '../../redux/AuthReducer.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import Octicons from 'react-native-vector-icons/Octicons';

const SettingScreens = ({navigation}: any) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(removeAuth());
    AsyncStorage.removeItem('auth')
      .then(() => {
        console.log('Item removed successfully');
      })
      .catch(error => {
        console.error('Failed to remove the item:', error);
      });
  };
  return (
    <SafeAreaView style={Styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <View style={Styles.headerContainer}>
        <Text style={Styles.headerText}>Tài khoản</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name={'arrow-back-ios'} size={24} />
        </TouchableOpacity>
      </View>
      <ButtonComponent
        title={'Đăng xuất'}
        onPress={handleLogout}
        style={styles.button}
        styleText={styles.textButton}
        logo={
          <Octicons
            name={'sign-out'}
            size={20}
            color={AppColors.secondary}
            style={styles.logo}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: AppColors.greyLine,
    borderRadius: 10,
  },
  textButton: {
    color: AppColors.secondary,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  logo: {
    marginHorizontal: 10,
  },
});

export default SettingScreens;
