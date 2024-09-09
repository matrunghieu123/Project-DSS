import React from 'react';
import {
  AllChatScreen,
  FacebookChatScreen,
  InternalChatScreen,
  TelegramChatScreen,
  ZaloChatScreen,
} from '../index';

interface ContentScreenProps {
  activeTab: string;
  navigation: any;
}

const ContentScreen: React.FC<ContentScreenProps> = ({activeTab, navigation}) => {
  switch (activeTab) {
    case 'all':
      return <AllChatScreen navigation={navigation}/>;
    case 'internal':
      return <InternalChatScreen />;
    case 'facebook':
      return <FacebookChatScreen />;
    case 'zalo':
      return <ZaloChatScreen />;
    case 'telegram':
      return <TelegramChatScreen />;
    default:
      return null;
  }
};

export default ContentScreen;
