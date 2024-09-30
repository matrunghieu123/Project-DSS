import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingNavigator} from './SettingNavigator.tsx';
import BottomTabNavigator from './BottomTabNavigator.tsx';
import {ChatScreen, NotificationScreen} from '../screens';
import CallNavigator from './CallNavigator.tsx';

export const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Call" component={CallNavigator} />
      <Stack.Screen name="Setting" component={SettingNavigator} />
      <Stack.Screen name="ChatScreen" component={ChatScreen}/>
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
};
