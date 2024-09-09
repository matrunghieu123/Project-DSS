import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MultiChannelIcon from '../../../assets/svg/MultiChannelIcon.tsx';
import FacebookIcon from '../../../assets/svg/FacebookIcon.tsx';
import TelegramIcon from '../../../assets/svg/TelegramIcon.tsx';
import ZaloIcon from '../../../assets/svg/ZaloIcon.tsx';
import InternalIcon from '../../../assets/svg/InternalIcon.tsx';
import {AppColors} from '../../core/constants/AppColors.ts';

interface TopTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TopTabBar: React.FC<TopTabBarProps> = ({activeTab, setActiveTab}) => {
  const tabs = [
    {name: 'Tất cả', key: 'all', icon: <MultiChannelIcon />},
    {name: 'Nội bộ', key: 'internal', icon: <InternalIcon />},
    {name: 'Facebook', key: 'facebook', icon: <FacebookIcon />},
    {name: 'Zalo', key: 'zalo', icon: <ZaloIcon />},
    {name: 'Telegram', key: 'telegram', icon: <TelegramIcon />},
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={[styles.touch, activeTab === tab.key ? styles.active : null]}>
          {tab.icon}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  touch: {
    padding: 10,
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: AppColors.primary,
  },
});

export default TopTabBar;
