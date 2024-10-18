import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Styles} from '../../../core/constants/Styles';
import {Constants} from '../../../core/constants/Constants';
import {ButtonComponent, TextFieldComponent} from '../../components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Fonts} from '../../../core/constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../../core/constants/AppColors';
import {Validate} from '../../../core/utils/Validate.ts';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../redux/AuthReducer.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenticationAPI from '../../../services/auth_api.ts';
import LoadingModal from '../../modal/LoadingModal.tsx';
import {LoginModel} from '../../../models/LoginModel.ts';

const initValues = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const dispatch = useDispatch();
  const [values, setValues] = useState(initValues);
  const [validValues, setValidValues] = useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues({...values, [name]: value});
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response: LoginModel = await authenticationAPI.login('CRM', '1');
      const loginResponsePlain = JSON.parse(JSON.stringify(response));

      dispatch(addAuth(loginResponsePlain));
      await AsyncStorage.setItem('auth', JSON.stringify(loginResponsePlain));
    } catch (error) {
      Alert.alert(
        'Đăng nhập thất bại',
        'Vui lòng kiểm tra lại thông tin đăng nhập',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const emailValidation = Validate.email(values.email);
    const passwordValidation = Validate.password(values.password);
    setValidValues({
      email: emailValidation,
      password: passwordValidation,
    });
  }, [values]);

  return (
    <>
      <LoadingModal visible={loading} text={'Loading...'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={Styles.container}>
          <Image source={{uri: Constants.logoUrl}} style={styles.image} />
          <Text style={styles.title}>Đăng nhập</Text>
          <TextFieldComponent
            height={56}
            prefix={<Icon name={'mail-outline'} style={styles.icon} />}
            placeholder="Nhập email"
            keyboardType={'email-address'}
            returnKeyType={'next'}
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            value={values.email}
            onChangeText={(text: string) => handleChange('email', text)}
          />
          {!validValues.email && values.email !== '' ? (
            <Text style={styles.errorText}>Email không hợp lệ</Text>
          ) : null}
          <TextFieldComponent
            height={56}
            prefix={<Icon name={'lock-outline'} style={styles.icon} />}
            placeholder="Nhập mật khẩu"
            keyboardType={'default'}
            returnKeyType={'done'}
            onSubmitEditing={
              validValues.email && validValues.password
                ? handleLogin
                : undefined
            }
            secureTextEntry={true}
            ref={passwordRef}
            value={values.password}
            onChangeText={(text: string) => handleChange('password', text)}
          />
          {!validValues.password && values.password !== '' ? (
            <Text style={styles.errorText}>
              Mật khẩu tối thiểu phải có 6 kí tự
            </Text>
          ) : null}
          <ForgotPassword navigation={navigation} />
          <ButtonComponent
            title="Đăng nhập"
            onPress={handleLogin}
            disabled={!(validValues.email && validValues.password)}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

const ForgotPassword = ({navigation}: any) => {
  return (
    <TouchableOpacity
      style={styles.forgotPasswordContainer}
      onPress={() => navigation.navigate('ForgotPasswordScreen')}>
      <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '72%',
    height: '10%',
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    marginTop: 30,
    marginBottom: 10,
    color: AppColors.black,
  },
  icon: {
    fontSize: 20,
    color: AppColors.greyIcon,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  forgotPassword: {
    color: AppColors.primary,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  errorText: {
    color: AppColors.red,
    alignSelf: 'flex-start',
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
export default LoginScreen;
