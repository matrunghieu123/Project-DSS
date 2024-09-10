import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MultiChannelIcon from '../../../assets/svg/MultiChannelIcon.tsx';
import FacebookIcon from '../../../assets/svg/FacebookIcon.tsx';
import TelegramIcon from '../../../assets/svg/TelegramIcon.tsx';
import ZaloIcon from '../../../assets/svg/ZaloIcon.tsx';
import InternalIcon from '../../../assets/svg/InternalIcon.tsx';
import {Styles} from '../../core/constants/Styles.ts';

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
          style={[styles.touch]}>
          <View
            style={[
              styles.view,
              activeTab === tab.key ? Styles.boxShadow : null,
            ]}>
            {tab.icon}
          </View>
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
    padding: 5,
  },
  view: {
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default TopTabBar;
