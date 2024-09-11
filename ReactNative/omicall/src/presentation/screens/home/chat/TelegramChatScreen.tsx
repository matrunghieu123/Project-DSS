import React from 'react';
import {ChatComponent} from '../../../components';

const TelegramChatScreen = ({navigation}: any) => {
  return (
    <ChatComponent type={'telegram'} navigation={navigation} name={'Bot Telegram'} content={'Telegram'} />
  );
};

export default TelegramChatScreen;
