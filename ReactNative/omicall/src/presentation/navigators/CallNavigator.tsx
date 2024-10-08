import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {CallScreen} from '../screens';

const Stack = createNativeStackNavigator();

const CallNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CallScreen" component={CallScreen} />
    </Stack.Navigator>
  );
};

export default CallNavigator;
