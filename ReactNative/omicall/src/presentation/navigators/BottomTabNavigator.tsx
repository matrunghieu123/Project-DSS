import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CallScreen,
  ContactsScreen,
  HistoryScreen,
  RecordScreen,
} from '../screens';
import {HomeNavigator} from './HomeNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../../core/constants/AppColors.ts';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}: {route: any}) => ({
  headerShown: false,
  tabBarIcon: ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => {
    let iconName = '';
    color = focused ? AppColors.secondary : 'gray';
    switch (route.name) {
      case 'Đa kênh':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Phiếu ghi':
        iconName = focused ? 'document-text' : 'document-text-outline';
        break;
      case 'Cuộc gọi':
        iconName = focused ? 'call' : 'call-outline';
        break;
      case 'Danh bạ':
        iconName = focused ? 'people' : 'people-outline';
        break;
      case 'Lịch sử':
        iconName = focused ? 'time' : 'time-outline';
        break;
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarLabel: ({focused}: {focused: boolean}) =>
    focused ? (
      <Ionicons name="ellipse" size={6} color={AppColors.secondary} />
    ) : null,
});

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Đa kênh" component={HomeNavigator} />
      <Tab.Screen name="Phiếu ghi" component={RecordScreen} />
      <Tab.Screen name="Cuộc gọi" component={CallScreen} />
      <Tab.Screen name="Danh bạ" component={ContactsScreen} />
      <Tab.Screen name="Lịch sử" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
