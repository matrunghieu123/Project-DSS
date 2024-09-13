import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/AuthReducer';

interface MessageBubbleProps {
  message: string;
  senderName: string;
  showSenderName: boolean;
  time: string;
}

const MessageBubble = (props: MessageBubbleProps) => {
  const {message, senderName, showSenderName, time} = props;
  const user = useSelector(authSelector);
  return (
    <View>
      {showSenderName && user.name !== senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View
        style={[
          styles.messageContainer,
          user.name === senderName
            ? styles.sentMessageContainer
            : styles.receivedMessageContainer,
        ]}>
        <Text
          style={[
            styles.messageText,
            user.name === senderName
              ? styles.sentMessageText
              : styles.receivedMessageText,
          ]}>
          {message}
        </Text>
        <Text
          style={[
            styles.time,
            user.name === senderName ? styles.sentTime : styles.receivedTime,
          ]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  senderName: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.grey,
    marginBottom: 2,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessageContainer: {
    backgroundColor: AppColors.secondary,
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receivedMessageContainer: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: AppColors.black,
  },
  time: {
    fontSize: 11,
    marginTop: 5,
  },
  sentTime: {
    color: AppColors.lightGrey,
  },
  receivedTime: {
    color: AppColors.grey,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
