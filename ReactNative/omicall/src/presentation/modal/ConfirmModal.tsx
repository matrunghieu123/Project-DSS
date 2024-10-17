import {View, Text, Modal, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import {Fonts} from '../../core/constants/Fonts.ts';
import {ButtonComponent, RowComponent} from '../components';
import {AppColors} from '../../core/constants/AppColors.ts';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <Modal animationType={'none'} visible={props.visible} transparent={true}>
      <StatusBar backgroundColor={'rgba(0, 0, 0, 0.5)'} barStyle="dark-content" />
      <View style={styles.modalBackground}>
        <View>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.message}>{props.message}</Text>
            <RowComponent>
              <ButtonComponent
                title={'Xác nhận'}
                onPress={props.onConfirm}
                style={[styles.button, styles.confirmButton]}
                styleText={styles.textConfirm}
              />
              <ButtonComponent
                title={'Đóng'}
                onPress={props.onCancel}
                style={[styles.button, styles.cancelButton]}
                styleText={styles.textCancel}
              />
            </RowComponent>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 22,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 20,
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: 140,
    height: 45,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: AppColors.secondary,
  },
  cancelButton: {
    backgroundColor: AppColors.lightGrey,
  },
  textConfirm: {
    fontFamily: Fonts.regular,
    color: 'white',
  },
  textCancel: {
    fontFamily: Fonts.regular,
    color: 'black',
  },
});

export default ConfirmModal;
