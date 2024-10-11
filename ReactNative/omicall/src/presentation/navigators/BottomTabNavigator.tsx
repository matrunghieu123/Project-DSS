import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeNavigator} from './HomeNavigator';
import {ContactsScreen, HistoryScreen, RecordScreen} from '../screens';
import {AppColors} from '../../core/constants/AppColors.ts';
import {useNavigation} from '@react-navigation/native';
import {Styles} from '../../core/constants/Styles.ts';
import {Fonts} from '../../core/constants/Fonts.ts';

const BottomTabNavigator = () => {
  const navigation = useNavigation<any>();

  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'Đa kênh':
        icon = 'home';
        break;
      case 'Phiếu ghi':
        icon = 'document-text';
        break;
      case 'Danh bạ':
        icon = 'people';
        break;
      case 'Lịch sử':
        icon = 'time';
        break;
      default:
        icon = 'home';
    }

    return (
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? AppColors.secondary : AppColors.grey}
      />
    );
  };

  const renderTabBar = ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (routeName: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={Styles.center}>
        {_renderIcon(routeName, selectedTab)}
        <Text
          style={{
            color:
              routeName === selectedTab ? AppColors.secondary : AppColors.grey,
            fontFamily: routeName === selectedTab ? Fonts.bold : Fonts.regular,
            fontSize: 14,
            marginVertical: 5,
          }}>
          {routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      screenOptions={{
        headerShown: false,
      }}
      type="DOWN"
      shadowStyle={styles.shadow}
      circleWidth={60}
      height={75}
      bgColor="white"
      initialRouteName="Đa kênh"
      borderTopLeftRight
      renderCircle={() => (
        <TouchableOpacity
          style={styles.btnCircleUp}
          onPress={() => navigation.navigate('Call')}>
          <Ionicons name={'call'} color="white" size={25} />
        </TouchableOpacity>
      )}
      tabBar={renderTabBar}>
      <CurvedBottomBar.Screen
        name="Đa kênh"
        position="LEFT"
        component={HomeNavigator}
      />
      <CurvedBottomBar.Screen
        name="Phiếu ghi"
        component={RecordScreen}
        position="LEFT"
      />
      <CurvedBottomBar.Screen
        name="Danh bạ"
        component={ContactsScreen}
        position="RIGHT"
      />
      <CurvedBottomBar.Screen
        name="Lịch sử"
        component={HistoryScreen}
        position="RIGHT"
      />
    </CurvedBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    bottom: 20,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
});

export default BottomTabNavigator;
