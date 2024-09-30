import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FilterScreen, HomeScreen, NotificationScreen} from '../screens';

export const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
    </Stack.Navigator>
  );
};
