import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {RefObject} from 'react';
import {
  Alert,
  FlatList, Platform, StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ListPhoneModel} from '../../../models/ListPhoneModel';
import {Styles} from '../../../core/constants/Styles';
import {Fonts} from '../../../core/constants/Fonts';
import {ButtonSquare, RowComponent} from '../../components';
import {AppColors} from '../../../core/constants/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import alohubAPI from '../../../services/alohub_api.ts';
import {Constants} from '../../../core/constants/Constants.ts';
import authenticationAPI from '../../../services/auth_api.ts';

interface Props {
  bottomSheetRef: RefObject<BottomSheet>;
  listPhone: ListPhoneModel;
  setPhoneChoose: (phone: string) => void;
}

const BottomSheetListPhone = (props: Props) => {
  const {bottomSheetRef, listPhone, setPhoneChoose} = props;
  const backdrop = (backdropProps: any) => (
    <BottomSheetBackdrop
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  const renderItem = ({item}: any) => {
    const handleOnPress = async (item: any) => {
      bottomSheetRef.current?.close();
      try {
        const response = (await alohubAPI.HandleSetPhoneNumber(
          Constants.usernameAlohub,
          item.CallInID,
          [Constants.extensionAlohub],
        )) as any;

        if (response.success) {
          await authenticationAPI.HandleListPhone(
            'put',
            item.CM_PhoneNumber_ID,
            {isDefault: true},
          );

          const currentDefaultPhone = listPhone.records.find(
            phone => phone.IsDefault,
          );

          if (currentDefaultPhone) {
            await authenticationAPI.HandleListPhone(
              'put',
              String(currentDefaultPhone.CM_PhoneNumber_ID),
              {isDefault: false},
            );
          }

          Alert.alert('Thành công', 'Đã chọn số thành công');
          setPhoneChoose(`${item.Value} - ${item.Name}`);
        } else {
          Alert.alert('Thất bại', 'Chọn số thất bại');
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    };

    return (
      <TouchableOpacity onPress={() => handleOnPress(item)}>
        <RowComponent style={styles.item}>
          <ButtonSquare
            icon={
              <FontAwesome
                name={item.IsDefault ? 'check-circle' : 'circle-thin'}
                size={23}
                color={item.IsDefault ? AppColors.primary : AppColors.black}
              />
            }
            backgroundColor={AppColors.grey}
            onPress={() => handleOnPress(item)}
          />
          <View style={styles.box}>
            <Text style={styles.phone}>{item.Value}</Text>
            <Text style={styles.name}>{item.Name}</Text>
          </View>
        </RowComponent>
      </TouchableOpacity>
    );
  };
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <BottomSheet
      snapPoints={['55%']}
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={backdrop}
    >
      <BottomSheetView style={[Styles.flex, styles.container]}>
        <RowComponent style={styles.row}>
          <View>
            <Text style={styles.title}>Danh sách đầu số</Text>
            <Text style={styles.description}>
              {listPhone ? listPhone.records.length : 0} giá trị
            </Text>
          </View>
          <ButtonSquare
            icon={
              <Ionicons name="search" size={23} color={AppColors.secondary} />
            }
            onPress={() => console.log('search')}
            backgroundColor={AppColors.grey}
          />
        </RowComponent>
        <FlatList
          keyExtractor={(item, _) => item.CM_PhoneNumber_ID.toString()}
          data={listPhone ? listPhone.records : []}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontFamily: Fonts.regular,
    color: AppColors.grey,
  },
  item: {
    alignItems: 'center',
  },
  box: {
    marginHorizontal: 15,
  },
  phone: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    marginBottom: 5,
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: AppColors.grey,
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.lightGrey,
    marginVertical: 10,
  },
});
export default BottomSheetListPhone;
