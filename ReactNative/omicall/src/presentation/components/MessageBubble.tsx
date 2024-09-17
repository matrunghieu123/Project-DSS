import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/AuthReducer';
import {Constants} from '../../core/constants/Constants.ts';
import ImageView from 'react-native-image-viewing';
import FileViewer from 'react-native-file-viewer';
import {FileComponent} from './index.ts';
import {getFileSize} from '../../services/AxiosService.ts';
import RNFS from 'react-native-fs';
interface MessageBubbleProps {
  message?: string;
  senderName: string;
  showSenderName: boolean;
  time: string;
  fileUrl?: string;
  fileType?: string;
}

const MessageBubble = (props: MessageBubbleProps) => {
  const {message, senderName, showSenderName, time, fileUrl, fileType} = props;
  const [visible, setIsVisible] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const user = useSelector(authSelector);

  const getFileNameFromUrl = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0];
  };

  const handleOpenFile = () => {
    if (fileUrl) {
      const path = `${RNFS.DocumentDirectoryPath}/${getFileNameFromUrl(fileUrl)}`;
      console.log('Path: ', path);
      RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: path,
      }).promise.then(() => {
        FileViewer.open(path, {displayName: getFileNameFromUrl(fileUrl)})
          .then(() => {
            console.log('File opened');
          })
          .catch(error => {
            console.log('Error opening file: ', error);
          });
      });
    }
  };

  useEffect(() => {
    if (fileUrl && fileType === 'file') {
      getFileSize(fileUrl).then(size => setFileSize(size));
    }
  }, [fileUrl, fileType]);

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
        {fileUrl && fileType === 'media' && (
          <>
            <ImageView
              images={[{uri: fileUrl}]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Image
                source={{uri: fileUrl}}
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
        {fileUrl && fileType === 'file' && fileSize !== null && (
          <TouchableOpacity onPress={handleOpenFile}>
            <FileComponent
              file={{
                uri: fileUrl,
                name: getFileNameFromUrl(fileUrl),
                size: fileSize,
                fileCopyUri: fileUrl,
                type: 'file',
              }}
              allowRemove={false}
              style={styles.file}
            />
          </TouchableOpacity>
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
  file: {
    marginTop: 0,
    marginLeft: 0,
    borderTopRightRadius: 0,
  },
});

export default MessageBubble;
