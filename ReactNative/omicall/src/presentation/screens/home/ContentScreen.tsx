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
}

const ContentScreen: React.FC<ContentScreenProps> = ({activeTab}) => {
  switch (activeTab) {
    case 'all':
      return <AllChatScreen />;
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
