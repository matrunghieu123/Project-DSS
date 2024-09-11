import {
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

const initValues = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const [values, setValues] = useState(initValues);
  const [validValues, setValidValues] = useState({
    email: false,
    password: false,
  });

  const handleChange = (name: string, value: string) => {
    setValues({...values, [name]: value});
  };

  const handleLogin = () => {
    console.log('Login');
    navigation.navigate('HomeScreen');
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={Styles.container}>
        <Image source={{uri: Constants.logoUrl}} style={styles.image} />
        <Text style={styles.title}>Đăng nhập</Text>
        <TextFieldComponent
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
          prefix={<Icon name={'lock-outline'} style={styles.icon} />}
          placeholder="Nhập mật khẩu"
          keyboardType={'default'}
          returnKeyType={'done'}
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
        <ForgotPassword/>
        <ButtonComponent
          title="Đăng nhập"
          onPress={handleLogin}
          disabled={!(validValues.email && validValues.password)}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    width: '70%',
    height: '10%',
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    marginTop: 30,
    marginBottom: 10,
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
