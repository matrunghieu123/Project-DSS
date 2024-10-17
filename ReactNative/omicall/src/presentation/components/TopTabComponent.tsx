import React, {useRef, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import MultiChannelIcon from '../../../assets/svg/MultiChannelIcon.tsx';
import FacebookIcon from '../../../assets/svg/FacebookIcon.tsx';
import TelegramIcon from '../../../assets/svg/TelegramIcon.tsx';
import ZaloIcon from '../../../assets/svg/ZaloIcon.tsx';
import InternalIcon from '../../../assets/svg/InternalIcon.tsx';

interface TopTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TopTabBar: React.FC<TopTabBarProps> = ({activeTab, setActiveTab}) => {
  const boxShadowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(boxShadowAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: activeTab ? 1 : 0.9,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [activeTab, boxShadowAnim, scaleAnim]);

  const tabs = [
    {name: 'Tất cả', key: 'all', icon: <MultiChannelIcon />},
    {name: 'Nội bộ', key: 'internal', icon: <InternalIcon />},
    {name: 'Facebook', key: 'facebook', icon: <FacebookIcon />},
    {name: 'Zalo', key: 'zalo', icon: <ZaloIcon />},
    {name: 'Telegram', key: 'telegram', icon: <TelegramIcon />},
  ];

  const boxShadowStyle = (isActive: boolean) => ({
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: boxShadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: isActive ? [0, 0.15] : [0.15, 0],
    }),
    shadowRadius: boxShadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: isActive ? [0, 3.84] : [3.84, 0],
    }),
    elevation: boxShadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: isActive ? [0, 5] : [5, 0],
    }),
  });

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={styles.touch}>
          <Animated.View
            style={[
              styles.view,
              activeTab === tab.key ? boxShadowStyle(true) : boxShadowStyle(false),
              {
                transform: [
                  {
                    scale: activeTab === tab.key
                      ? scaleAnim.interpolate({
                        inputRange: [0, 0.9],
                        outputRange: [0.9, 1],
                      })
                      : scaleAnim.interpolate({
                        inputRange: [0, 0.9],
                        outputRange: [1, 0.9],
                      }),
                  },
                ],
              },
            ]}>
            {tab.icon}
          </Animated.View>
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
