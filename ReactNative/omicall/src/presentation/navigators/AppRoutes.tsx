import React, {useEffect, useState} from 'react';
import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {MainNavigator} from './MainNavigator.tsx';

const AppRoutes = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);
  return (
    <NavigationContainer>
      {isShowSplash ? (
        <SplashScreen />
      ) : 5 > 0 ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
export default AppRoutes;
