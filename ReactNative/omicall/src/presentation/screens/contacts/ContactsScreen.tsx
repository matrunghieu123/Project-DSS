import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Styles} from '../../../core/constants/Styles.ts';
import {RowComponent, SpaceComponent, TopContainer} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import TabComponent from './components/TabComponent.tsx';
import ContactTab from './tabs/ContactTab.tsx';
import StaffTab from './tabs/StaffTab.tsx';
import DeviceTab from './tabs/DeviceTab.tsx';

const ContactsScreen = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [length, setLength] = useState(0);
  const tabs = ['OMI', 'Nhân viên', 'Thiết bị'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ContactTab />;
      case 1:
        return <StaffTab />;
      case 2:
        return <DeviceTab navigation={navigation} setLength={setLength} />;
      default:
        return null;
    }
  };

  return (
    <View style={Styles.flex}>
      <TopContainer
        navigation={navigation}
        child={<AddContactButton navigation={navigation} />}
      />
      <SpaceComponent height={10} />
      <View style={[Styles.boxShadow, styles.topTabContainer]}>
        <Text style={styles.title}>Danh bạ</Text>
        <Text style={styles.description}>
          {length} {activeTab === 1 ? 'Nhân viên' : 'Khách hàng'}
        </Text>
        <SearchButton navigation={navigation} />
        <FilterButton navigation={navigation} />
        <RowComponent style={{marginTop: 10}}>
          {tabs.map((tab, index) => (
            <TabComponent
              key={index}
              name={tab}
              active={activeTab === index}
              onPress={() => setActiveTab(index)}
            />
          ))}
        </RowComponent>
      </View>
      {renderTabContent()}
    </View>
  );
};

const AddContactButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddContactScreen')}
      style={styles.contactContainer}>
      <Ionicons name="person-add" size={23} color={'white'} />
    </TouchableOpacity>
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
  contactContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: AppColors.green,
    borderRadius: 15,
  },
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

export default ContactsScreen;
