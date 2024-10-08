import {ChatComponent} from '../../../components';
import React from 'react';

const TelegramChatScreen = ({navigation}: any) => {
  return (
    <ChatComponent
      type={'group'}
      navigation={navigation}
      name={'Telegram'}
      content={'Bạn có tin nhắn mới'}
    />
  );
};

export default TelegramChatScreen;
