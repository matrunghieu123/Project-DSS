import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Styles} from '../../../core/constants/Styles.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import {AppColors} from '../../../core/constants/AppColors.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextFieldComponent,
} from '../../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AddContactScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={[Styles.flex, styles.container]}>
      <Header navigation={navigation} />
      <Form />
    </View>
  );
};

const Header = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <MaterialIcons
          name={'arrow-back-ios'}
          size={24}
          color={AppColors.secondary}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>Thêm khách hàng</Text>
      <SpaceComponent width={24} style={styles.backButton} />
    </SafeAreaView>
  );
};

const Form = () => {
  const [gender, setGender] = useState(0);
  const genders = ['Nam', 'Nữ', 'Khác'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giới tính</Text>
      <RowComponent style={{justifyContent: 'space-evenly', marginVertical: 5}}>
        {genders.map((item, index) => (
          <CheckBox
            key={index}
            label={item}
            onPress={() => setGender(index)}
            checked={gender === index}
          />
        ))}
      </RowComponent>
      <Text style={styles.title}>Tên đầy đủ</Text>
      <TextFieldComponent placeholder={'Nhập tên đầy đủ'} height={50} />
      <Text style={styles.title}>Số điện thoại</Text>
      <TextFieldComponent placeholder={'Nhập số điện thoại'} height={50} />
      <Text style={styles.title}>Email</Text>
      <TextFieldComponent placeholder={'Nhập email'} height={50} />
      <Text style={styles.title}>Nhân viên tiếp nhận</Text>
      <TextFieldComponent placeholder={'Nhập tên nhân viên'} height={50} />
      <Text style={styles.title}>Mô tả</Text>
      <TextFieldComponent
        placeholder={'Nhập mô tả'}
        height={100}
        multiline={true}
      />
      <ButtonComponent
        title="Thêm khách hàng"
        onPress={() => {}}
        style={styles.button}
      />
    </ScrollView>
  );
};

const CheckBox = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <RowComponent style={{alignItems: 'center'}}>
        <FontAwesome
          name={checked ? 'check-circle' : 'circle-thin'}
          size={24}
          color={checked ? AppColors.primary : AppColors.secondary}
        />
        <Text
          style={[
            styles.label,
            {color: checked ? AppColors.primary : AppColors.grey},
          ]}>
          {label}
        </Text>
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '3%',
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  backButton: {
    marginLeft: '3%',
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    color: AppColors.secondary,
  },
  label: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: Fonts.regular,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: AppColors.secondary,
  },
  button: {
    width: '100%',
    backgroundColor: AppColors.green,
  },
});

export default AddContactScreen;
