import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppColors} from '../../../core/constants/AppColors';
import {SpaceComponent, TopContainer, TopTabComponent} from '../../components';
import {Fonts} from '../../../core/constants/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContentScreen from './ContentScreen';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/AuthReducer';
import StompService from '../../../services/stomp_service.ts';
import {Styles} from '../../../core/constants/Styles.ts';

const HomeScreen: FC<{navigation: any}> = ({navigation}) => {
  const user = useSelector(authSelector).UserInfo;
  const [activeTab, setActiveTab] = useState('all');
  const stompService = StompService.getInstance(user.UserName);
  const tabNames: {[key: string]: string} = {
    all: 'Tất cả',
    internal: 'Nội bộ',
    facebook: 'Facebook',
    telegram: 'Telegram',
    zalo: 'Zalo',
  };

  useEffect(() => {
    stompService.connect();
    const checkConnection = setInterval(() => {
      if (stompService.isConnected()) {
        clearInterval(checkConnection);
      }
    }, 1000);

    return () => clearInterval(checkConnection);
  }, [stompService]);

  return (
    <View style={Styles.flex}>
      <TopContainer navigation={navigation} />
      <SpaceComponent height={10} />
      <View style={[Styles.boxShadow, styles.topTabContainer]}>
        <Text style={styles.title}>Cuộc trò chuyện</Text>
        <Text style={styles.description}>{tabNames[activeTab]}</Text>
        <SearchButton navigation={navigation} />
        <FilterButton navigation={navigation} />
        <TopTabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <ContentScreen activeTab={activeTab} navigation={navigation} />
    </View>
  );
};

const SearchButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => navigation.navigate('SearchScreen')}>
      <Ionicons name="search" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const FilterButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      style={styles.filterContainer}
      onPress={() => navigation.navigate('FilterScreen')}>
      <Ionicons name="filter" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topTabContainer: {
    backgroundColor: 'white',
    width: '95%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginBottom: 5,
    color: AppColors.black,
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
