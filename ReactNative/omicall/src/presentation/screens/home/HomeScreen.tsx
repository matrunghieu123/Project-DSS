import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {AvatarCircle, RowComponent, TopTabComponent} from '../../components';
import {Fonts} from '../../../core/constants/Fonts.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContentScreen from './ContentScreen.tsx';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState('all');
  const tabNames: {[key: string]: string} = {
    all: 'Tất cả',
    internal: 'Nội bộ',
    facebook: 'Facebook',
    telegram: 'Telegram',
    zalo: 'Zalo',
  };
  return (
    <View style={styles.container}>
      <TopContainer navigation={navigation} />
      <View style={styles.topTabContainer}>
        <Text style={styles.title}>Cuộc trò chuyện</Text>
        <Text style={styles.description}>{tabNames[activeTab]}</Text>
        <SearchButton navigation={navigation} />
        <FilterButton navigation={navigation} />
        <TopTabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <ContentScreen activeTab={activeTab} />
    </View>
  );
};
const TopContainer = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.topContainer}>
      <SafeAreaView>
        <RowComponent>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Setting', {
                screen: 'SettingScreen',
              })
            }>
            <AvatarCircle />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.name}>Name</Text>
            <Text style={styles.email}>abc@gmail.com</Text>
          </View>
          <NotificationButton navigation={navigation} />
        </RowComponent>
      </SafeAreaView>
    </View>
  );
};

const NotificationButton = ({navigation}: {navigation: any}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
      <View style={styles.notificationContainer}>
        <View style={styles.backgroundNotification} />
        <Ionicons name="notifications" size={23} color={'white'} />
      </View>
    </TouchableOpacity>
  );
};

const SearchButton = ({navigation}: {navigation: any}) => {
  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => navigation.navigate('SearchScreen')}>
      <Ionicons name="search" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const FilterButton = ({navigation}: {navigation: any}) => {
  return (
    <TouchableOpacity
      style={styles.filterContainer}
      onPress={() => navigation.navigate('FilterScreen')}>
      <Ionicons name="filter" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: AppColors.secondary,
    height: '18%',
    width: '100%',
    paddingTop: 10,
    marginBottom: 10,
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
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundNotification: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderRadius: 15,
    opacity: 0.1,
  },
  topTabContainer: {
    backgroundColor: 'white',
    width: '98%',
    height: '15%',
    alignSelf: 'center',
    borderRadius: 15,
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.grey,
  },
  searchContainer: {
    backgroundColor: AppColors.transparent,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: 65,
    top: 15,
  },
  filterContainer: {
    backgroundColor: AppColors.transparent,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: 15,
    top: 15,
  },
});
export default HomeScreen;
