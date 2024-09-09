import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Styles} from '../../../core/constants/Styles.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Fonts} from '../../../core/constants/Fonts.ts';
import {
  ButtonComponent,
  SpaceComponent,
  TextFieldComponent,
} from '../../components';
import {AppInfos} from '../../../core/constants/AppInfos.ts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Validate} from '../../../core/utils/validate.ts';

const ForgotPasswordScreen = ({navigation}: any) => {
  const emailRef = useRef<any>();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    const emailValidation = Validate.email(email);
    setValidEmail(emailValidation);
  }, [email]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={Styles.container}>
        <View style={Styles.headerContainer}>
          <Text style={Styles.headerText}>Quên mật khẩu</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name={'arrow-back-ios'} size={24} />
          </TouchableOpacity>
        </View>
        <SpaceComponent height={AppInfos.sizes.height * 0.05} />
        <TextFieldComponent
          prefix={<Icon name={'mail-outline'} style={styles.icon} />}
          placeholder="Nhập email"
          keyboardType={'email-address'}
          returnKeyType={'done'}
          ref={emailRef}
          onSubmitEditing={() => {}}
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
        {!validEmail && email !== '' ? (
          <Text style={styles.errorText}>Email không hợp lệ</Text>
        ) : null}
        <ButtonComponent
          title={'Gửi yêu cầu'}
          onPress={() => {}}
          disabled={!validEmail}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: AppColors.greyIcon,
  },
  errorText: {
    color: AppColors.red,
    alignSelf: 'flex-start',
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
export default ForgotPasswordScreen;
