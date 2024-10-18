import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/AuthReducer.ts';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AvatarCircle, RowComponent, SpaceComponent} from './index.ts';
import {Styles} from '../../core/constants/Styles.ts';
import {AppColors} from '../../core/constants/AppColors.ts';
import {Fonts} from '../../core/constants/Fonts.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TopContainer: FC<{navigation: any; child?: any}> = ({
  navigation,
  child,
}) => {
  const user = useSelector(authSelector).UserInfo;
  return (
    <View style={styles.topContainer}>
      <SafeAreaView>
        <StatusBar
          backgroundColor={AppColors.secondary}
          barStyle="light-content"
        />
        <RowComponent>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Setting', {
                screen: 'SettingScreen',
              })
            }>
            <AvatarCircle style={{width: 50, height: 50}} />
          </TouchableOpacity>
          <SpaceComponent width={10} />
          <View style={Styles.flex}>
            <Text style={styles.name} numberOfLines={1}>
              {user.UserName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.Email}
            </Text>
          </View>
          {child}
          <NotificationButton navigation={navigation} />
        </RowComponent>
      </SafeAreaView>
    </View>
  );
};

const NotificationButton = ({navigation}: any) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
      <View style={styles.notificationContainer}>
        <View style={styles.backgroundNotification} />
        <Ionicons name="notifications" size={23} color={'white'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: AppColors.secondary,
    paddingHorizontal: '5%',
    paddingVertical: '3%',
  },
  name: {
    fontSize: 19,
    fontFamily: Fonts.medium,
    color: 'white',
    marginBottom: 5,
  },
  email: {
    color: AppColors.grey,
    fontFamily: Fonts.regular,
  },
  notificationContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundNotification: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderRadius: 15,
    opacity: 0.1,
  },
});

export default TopContainer;
