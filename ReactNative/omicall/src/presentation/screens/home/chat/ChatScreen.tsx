import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AvatarCircle,
  MessageBubble,
  RowComponent,
  SpaceComponent,
} from '../../../components';
import {Fonts} from '../../../../core/constants/Fonts';
import {AppColors} from '../../../../core/constants/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StompService from '../../../../services/StompService';
import {Status} from '../../../../core/constants/Status';
import {MessageModel} from '../../../../models/MessageModel';
import {authSelector} from '../../../redux/AuthReducer';
import {useSelector} from 'react-redux';
import SendMessage from './components/SendMessage';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheetComponent from './components/BottomSheetComponent.tsx';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import * as DocumentPicker from 'react-native-document-picker';

const ChatScreen = ({navigation, route}: any) => {
  const {name, type} = route.params;
  const user = useSelector(authSelector).UserInfo;
  const scrollViewRef = useRef<ScrollView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mediaPicked, setMediaPicked] = useState<ImageOrVideo | undefined>(
    undefined,
  );
  const [filePicked, setFilePicked] = useState<
    DocumentPicker.DocumentPickerResponse | undefined
  >(undefined);
  const stompService = StompService.getInstance(user.userName);

  const handleDotsPress = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.expand();
  };

  const handleNewMessage = useCallback(
    (message: MessageModel) => {
      if (
        message.status === Status.MESSAGE &&
        message.senderName !== user.UserName
      ) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: message.message,
            senderName: message.senderName,
            time: message.time,
            fileUrl: message.fileUrl,
            fileType: message.fileType,
          },
        ]);
      }
    },
    [user.UserName],
  );

  const handleSendMessage = (message: string, fileUrl: string, fileType: string) => {
    const newMessage = {
      id: messages.length + 1,
      text: message,
      senderName: user.UserName,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      fileUrl: fileUrl,
      fileType: fileType,
    };
    setMessages([...messages, newMessage]);
    switch (type) {
      case 'group': {
        stompService.sendMessagePublic({
          senderName: user.UserName,
          message,
          status: Status.MESSAGE,
          fileUrl: fileUrl,
          fileType: fileType,
        });
        break;
      }
      case 'private': {
        stompService.sendMessagePrivate({
          senderName: user.UserName,
          receiverName: name,
          message,
          status: Status.MESSAGE,
          fileUrl: fileUrl,
          fileType: fileType,
        });
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    return () => interactionPromise.cancel();
  }, [messages]);

  useEffect(() => {
    stompService.setOnMessageCallback(handleNewMessage);
  }, [stompService, handleNewMessage]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeArea}>
        <HeaderChat navigation={navigation} name={name} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <View style={[styles.flex, {backgroundColor: AppColors.lightGrey}]}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollView}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }
              onLayout={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }>
              {messages.map((msg, index) => {
                const showSenderName =
                  index === 0 ||
                  messages[index - 1].senderName !== msg.senderName;
                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg.text}
                    senderName={msg.senderName}
                    showSenderName={showSenderName && type === 'group'}
                    time={msg.time}
                    fileUrl={msg.fileUrl}
                    fileType={msg.fileType}
                  />
                );
              })}
            </ScrollView>
          </View>
          <SendMessage
            onSendMessage={handleSendMessage}
            onDotsPress={handleDotsPress}
            mediaPicked={mediaPicked}
            filePicked={filePicked}
            setMediaPicked={setMediaPicked}
            setFilePicked={setFilePicked}
          />
        </KeyboardAvoidingView>
        <BottomSheetComponent
          bottomSheetRef={bottomSheetRef}
          setMediaPicked={setMediaPicked}
          setFilePicked={setFilePicked}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const HeaderChat = ({navigation, name}: any) => {
  return (
    <RowComponent style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons
          name={'arrow-back-ios'}
          size={24}
          color={AppColors.secondary}
        />
      </TouchableOpacity>
      <AvatarCircle style={styles.avatar} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.online}>Đang hoạt động</Text>
      </View>
      <View style={styles.flex} />
      <Ionicons name={'call'} size={24} color={AppColors.secondary} />
      <SpaceComponent width={15} />
      <Ionicons name={'videocam'} size={24} color={AppColors.secondary} />
    </RowComponent>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  avatar: {
    height: 40,
    width: 40,
    marginBottom: 3,
    marginHorizontal: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  online: {
    fontSize: 13,
    color: AppColors.greyIcon,
  },
  scrollView: {
    padding: 10,
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});

export default ChatScreen;
