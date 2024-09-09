import React, {useEffect, useState} from 'react';
import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';

const AppRoutes = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);
  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};
export default AppRoutes;
