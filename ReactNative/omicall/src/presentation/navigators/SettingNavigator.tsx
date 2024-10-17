import {SettingScreens} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export const SettingNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SettingScreen" component={SettingScreens} />
    </Stack.Navigator>
  );
};
