import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingNavigator} from './SettingNavigator.tsx';
import BottomTabNavigator from './BottomTabNavigator.tsx';
import {
  AddContactScreen,
  CallScreen,
  ChatScreen,
  ChooseTagScreen,
  NotificationScreen,
} from '../screens';

export const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Group>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Group>
          <Stack.Screen name="CallScreen" component={CallScreen} />
        </Stack.Group>
        <Stack.Screen name="Setting" component={SettingNavigator} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="AddContactScreen" component={AddContactScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="ChooseTagScreen" component={ChooseTagScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
