import {View, Text, Modal, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {AppColors} from '../../core/constants/AppColors';
import {Styles} from '../../core/constants/Styles.ts';

interface LoadingModalComponentProps {
  visible: boolean;
  text?: string;
}

const LoadingModal = (props: LoadingModalComponentProps) => {
  const {visible, text} = props;
  return (
    <Modal
      style={Styles.flex}
      visible={visible}
      transparent
      statusBarTranslucent>
      <View style={styles.container}>
        <ActivityIndicator color={AppColors.white} size="large" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 16,
    color: AppColors.white,
  },
});
export default LoadingModal;
