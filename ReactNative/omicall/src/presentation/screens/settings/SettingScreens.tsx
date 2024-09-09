import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Styles} from '../../../core/constants/Styles.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text, TouchableOpacity, View} from 'react-native';

const SettingScreens = ({navigation}: any) => {
  return (
    <SafeAreaView style={Styles.container}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.headerText}>Tài khoản</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name={'arrow-back-ios'} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SettingScreens;
