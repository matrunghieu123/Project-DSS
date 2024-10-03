import React, {useCallback, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ChatComponent} from '../../../components';
import {MessageModel} from '../../../../models/MessageModel';
import {Status} from '../../../../core/constants/Status';
import {authSelector} from '../../../redux/AuthReducer';
import {useSelector} from 'react-redux';
import StompService from '../../../../services/stomp_service.ts';
import {useFocusEffect} from '@react-navigation/native';

const AllChatScreen = ({navigation}: any) => {
  const user = useSelector(authSelector).UserInfo;
  const stompService = StompService.getInstance(user.UserName);

  const [listChat, setListChat] = useState<React.ReactElement[]>([
    <ChatComponent
      type={'group'}
      navigation={navigation}
      name={'Chat chung'}
      content={'Bạn có tin nhắn mới'}
    />,
  ]);

  const handleNewChat = useCallback(
    (senderName: string) => {
      setListChat(prevListChat => [
        ...prevListChat,
        <ChatComponent
          key={senderName}
          type={'private'}
          navigation={navigation}
          name={senderName}
          content={'Bạn có tin nhắn mới'}
        />,
      ]);
    },
    [navigation],
  );

  const handleNewMessage = useCallback(
    (message: MessageModel) => {
      if (message.status === Status.JOIN && message.senderName !== user.UserName) {
        handleNewChat(message.senderName);
      } else if (message.status === Status.MESSAGE && message.senderName !== user.UserName) {
        setListChat(prevListChat => {
          const senderExists = prevListChat.some(
            chat => chat.props.name === message.senderName
          );
          if (!senderExists) {
            handleNewChat(message.senderName);
          }
          return prevListChat;
        });
      }
    },
    [user.UserName, handleNewChat],
  );

  useFocusEffect(
    useCallback(() => {
      stompService.setOnMessageCallback(handleNewMessage);
    }, [stompService, handleNewMessage])
  );

  return (
    <ScrollView>
      {listChat.map((chat, index) => (
        <View key={index}>{chat}</View>
      ))}
    </ScrollView>
  );
};

export default AllChatScreen;
