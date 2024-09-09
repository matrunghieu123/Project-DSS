import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CallScreen,
  ContactsScreen,
  HistoryScreen,
  HomeScreen,
  RecordScreen,
} from '../screens';

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Đa kênh" component={HomeScreen} />
      <Tab.Screen name="Phiếu ghi" component={RecordScreen} />
      <Tab.Screen name="Cuộc gọi" component={CallScreen} />
      <Tab.Screen name="Danh bạ" component={ContactsScreen} />
      <Tab.Screen name="Lịch sử " component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
