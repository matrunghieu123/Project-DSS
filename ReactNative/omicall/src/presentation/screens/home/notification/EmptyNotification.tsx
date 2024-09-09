import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BellEmptyNotification from '../../../../../assets/svg/BellEmptyNotification.tsx';
import {Fonts} from '../../../../core/constants/Fonts.ts';

const EmptyNotification = () => {
  return (
    <View
      style={styles.container}>
      <BellEmptyNotification/>
      <Text style={styles.title}>Không có thông báo</Text>
      <Text style={styles.description}>Bạn chưa có thông báo nào</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title:{
    fontSize: 20,
    fontFamily: Fonts.medium,
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
});

export default EmptyNotification;
