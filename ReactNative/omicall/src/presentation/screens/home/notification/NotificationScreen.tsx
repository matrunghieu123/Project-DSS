import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Styles} from '../../../../core/constants/Styles.ts';
import ConfirmModal from '../../../modal/ConfirmModal.tsx';
import EmptyNotification from './EmptyNotification.tsx';

const NotificationScreen = ({navigation}: {navigation: any}) => {
  const [visible, setVisible] = useState(false);
  return (
    <SafeAreaView style={Styles.container}>
      <ConfirmModal
        visible={visible}
        title={'Xác nhận'}
        message={'Bạn có chắc đánh dấu đã đọc tất cả thông báo?'}
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
      <View style={[Styles.headerContainer, styles.row]}>
        <Text style={Styles.headerText}>Thông báo</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name={'arrow-back-ios'} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <MaterialIcons name={'done-all'} size={24} />
        </TouchableOpacity>
      </View>
      <View>
        <EmptyNotification/>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  row: {justifyContent: 'space-between'},
});
export default NotificationScreen;
