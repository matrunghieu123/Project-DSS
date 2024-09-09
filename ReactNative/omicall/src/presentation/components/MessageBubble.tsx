import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppColors} from '../../core/constants/AppColors.ts';
import {Fonts} from '../../core/constants/Fonts.ts';

interface MessageBubbleProps {
  message: string;
  isSent: boolean;
}

const MessageBubble = (props: MessageBubbleProps) => {
  const {message, isSent} = props;
  return (
    <View
      style={[
        styles.messageContainer,
        isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
      ]}>
      <Text
        style={[
          styles.messageText,
          isSent ? styles.sentMessageText : styles.receivedMessageText,
        ]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MessageBubble;
