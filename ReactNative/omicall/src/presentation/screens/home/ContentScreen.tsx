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
      return <InternalChatScreen navigation={navigation} />;
    case 'facebook':
      return <FacebookChatScreen navigation={navigation} />;
    case 'zalo':
      return <ZaloChatScreen navigation={navigation}/>;
    case 'telegram':
      return <TelegramChatScreen navigation={navigation}/>;
    default:
      return null;
  }
};

export default ContentScreen;
