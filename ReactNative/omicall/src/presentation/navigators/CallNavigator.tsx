import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CallScreen} from '../screens';

export const CallNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CallScreen" component={CallScreen} />
    </Stack.Navigator>
  );
};
