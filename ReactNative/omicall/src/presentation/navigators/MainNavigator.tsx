import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingNavigator} from './SettingNavigator.tsx';
import BottomTabNavigator from './BottomTabNavigator.tsx';
import {ChatScreen} from '../screens';

export const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Setting" component={SettingNavigator} />
      <Stack.Screen name="ChatScreen" component={ChatScreen}/>
    </Stack.Navigator>
  );
};
