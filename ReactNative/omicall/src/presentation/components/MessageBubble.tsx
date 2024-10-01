import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/AuthReducer';
import ImageView from 'react-native-image-viewing';
import FileViewer from 'react-native-file-viewer';
import {FileComponent} from './index.ts';
import RNFS, {TemporaryDirectoryPath} from 'react-native-fs';
import axios from 'axios';
import {createThumbnail} from 'react-native-create-thumbnail';
import {Constants} from '../../core/constants/Constants.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const user = useSelector(authSelector).UserInfo;
  const [thumbnail, setThumbnail] = useState<string>('');
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const isImageMimeType = (mimeType: string) => mimeType.startsWith('image/');
  const isVideoMimeType = (mimeType: string) => mimeType.startsWith('video/');
  const isDocumentMimeType = (mimeType: string) => {
    const documentMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    return documentMimeTypes.includes(mimeType);
  };

  const getFileSize = async (url: string): Promise<number> => {
    try {
      const response = await axios.head(url);
      const contentLength = response.headers['content-length'];
      return parseInt(contentLength, 10);
    } catch (error) {
      console.error('Error fetching file size:', error);
      return 0;
    }
  };

  const getFileNameFromUrl = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0].split('fileUrl_')[1];
  };

  const handleOpenFile = () => {
    if (fileUrl) {
      const path = `${TemporaryDirectoryPath}/${getFileNameFromUrl(fileUrl)}`;
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

  const resizeImage = (path: string) => {
    Image.getSize(
      path,
      (width, height) => {
        let newWidth = width;
        let newHeight = height;

        if (
          width > Constants.MAX_WIDTH_IMAGE ||
          height > Constants.MAX_HEIGHT_IMAGE
        ) {
          const widthRatio = width / Constants.MAX_WIDTH_IMAGE;
          const heightRatio = height / Constants.MAX_HEIGHT_IMAGE;
          const ratio = Math.max(widthRatio, heightRatio);

          newWidth = width / ratio;
          newHeight = height / ratio;
        }

        setDimensions({width: newWidth, height: newHeight});
      },
      error => {
        console.error('Error getting image size:', error);
      },
    );
  };

  useEffect(() => {
    if (fileType && fileUrl) {
      if (isImageMimeType(fileType)) {
        setThumbnail(fileUrl);
        resizeImage(fileUrl);
      } else if (isVideoMimeType(fileType)) {
        createThumbnail({
          url: fileUrl,
        })
          .then(response => {
            setThumbnail(response.path);
            resizeImage(response.path);
          })
          .catch(err => console.log('Error creating thumbnail:', err));
      } else if (isDocumentMimeType(fileType)) {
        getFileSize(fileUrl).then(size => setFileSize(size));
      }
    }
  }, [fileUrl, fileType]);

  return (
    <View>
      {showSenderName && user.UserName !== senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View
        style={[
          styles.messageContainer,
          user.UserName === senderName
            ? styles.sentMessageContainer
            : styles.receivedMessageContainer,
        ]}>
        {fileUrl && fileType && (
          <>
            <ImageView
              images={[{uri: thumbnail}]}
              imageIndex={0}
              visible={visible && isImageMimeType(fileType)}
              onRequestClose={() => setIsVisible(false)}
            />
            <TouchableOpacity
              onPress={() => {
                if (isVideoMimeType(fileType)) {
                  // Play video
                } else {
                  setIsVisible(true); // Show image viewer
                }
              }}>
              {thumbnail && (
                <Image
                  source={{uri: thumbnail}}
                  style={[
                    styles.image,
                    {
                      width: dimensions.width,
                      height: dimensions.height,
                    },
                    user.UserName === senderName
                      ? styles.sentImage
                      : styles.receivedImage,
                  ]}
                />
              )}
              {isVideoMimeType(fileType) && (
                <View style={styles.playIconContainer}>
                  <Ionicons
                    name="play-circle"
                    size={50}
                    color={AppColors.greyLine}
                  />
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
        {fileUrl &&
          fileType &&
          isDocumentMimeType(fileType) &&
          fileSize !== null && (
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
                user.UserName === senderName
                  ? styles.sentMessageText
                  : styles.receivedMessageText,
              ]}>
              {message}
            </Text>
            <Text
              style={[
                styles.time,
                user.UserName === senderName
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
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageBubble;
