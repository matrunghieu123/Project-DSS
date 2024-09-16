import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/AuthReducer';
import {Constants} from '../../core/constants/Constants.ts';
import ImageView from 'react-native-image-viewing';

interface MessageBubbleProps {
  message?: string;
  senderName: string;
  showSenderName: boolean;
  time: string;
  image?: string;
}

const MessageBubble = (props: MessageBubbleProps) => {
  const {message, senderName, showSenderName, time, image} = props;
  const [visible, setIsVisible] = useState(false);
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
        {image && (
          <>
            <ImageView
              images={[{uri: image}]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Image
              source={{uri: image}}
              style={[
                styles.image,
                user.name === senderName
                  ? styles.sentImage
                  : styles.receivedImage,
              ]}
            />
          </TouchableOpacity>
          </>
        )}
        {message && (
          <View>
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
                user.name === senderName
                  ? styles.sentTime
                  : styles.receivedTime,
              ]}>
              {time}
            </Text>
          </View>
        )}
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
    maxWidth: '80%',
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
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: AppColors.black,
  },
  time: {
    fontSize: 11,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  sentTime: {
    color: AppColors.lightGrey,
  },
  receivedTime: {
    color: AppColors.grey,
    alignSelf: 'flex-end',
  },
  image: {
    width: Constants.WIDTH_IMAGE,
    height: Constants.HEIGHT_IMAGE,
    borderRadius: 10,
  },
  sentImage: {
    borderTopRightRadius: 0,
  },
  receivedImage: {
    borderTopLeftRadius: 0,
  },
});

export default MessageBubble;
