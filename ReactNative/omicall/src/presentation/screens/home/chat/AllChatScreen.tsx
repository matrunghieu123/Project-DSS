import React from 'react';
import {ChatComponent} from '../../../components';

const AllChatScreen = ({navigation}: any) => {
  return (
    <ChatComponent
      type={'all'}
      navigation={navigation}
      name={'Quang Anh'}
      content={'Bạn có tin nhắn mới'}
    />
  );
};

export default AllChatScreen;
