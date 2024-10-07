import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ContactsScreen, HistoryScreen, RecordScreen} from '../screens';
import {HomeNavigator} from './HomeNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../../core/constants/AppColors.ts';
import {EmptyComponent} from '../components';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '../../core/constants/Fonts.ts';

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
      case 'Danh bạ':
        iconName = focused ? 'people' : 'people-outline';
        break;
      case 'Lịch sử':
        iconName = focused ? 'time' : 'time-outline';
        break;
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarLabel: ({focused}: {focused: boolean}) => (
    <Text
      style={{
        color: focused ? AppColors.secondary : 'gray',
        fontFamily: focused ? Fonts.bold : Fonts.regular,
        fontSize: 13,
      }}>
      {route.name}
    </Text>
  ),
  tabBarStyle: {
    height: 90,
    paddingVertical: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

const CallButton = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.callButton}
      onPress={() => navigation.navigate('Call')}>
      <View style={styles.callButtonInner}>
        <Ionicons name="call" size={30} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Đa kênh" component={HomeNavigator} />
      <Tab.Screen name="Phiếu ghi" component={RecordScreen} />
      <Tab.Screen
        name="Cuộc gọi"
        component={EmptyComponent}
        options={{
          tabBarButton: () => <CallButton />,
        }}
      />
      <Tab.Screen name="Danh bạ" component={ContactsScreen} />
      <Tab.Screen name="Lịch sử" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  callButton: {
    top: -35,
    shadowColor: AppColors.black,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 3.5,
    elevation: 5,
  },
  callButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
