import React, {useEffect, useState} from 'react';
import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {MainNavigator} from './MainNavigator.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../redux/AuthReducer.ts';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const AppRoutes = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const {getItem} = useAsyncStorage('auth');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuth();
    const timeoutId = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  const checkAuth = async () => {
    const authData = await getItem();
    if (authData) {
      dispatch(addAuth(JSON.parse(authData)));
    }
  };

  return (
    <NavigationContainer>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth.accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
export default AppRoutes;
