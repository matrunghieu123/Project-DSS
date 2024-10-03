import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  AvatarCircle,
  MessageBubble,
  RowComponent,
  SpaceComponent,
} from '../../../components';
import {Fonts} from '../../../../core/constants/Fonts';
import {AppColors} from '../../../../core/constants/AppColors';
import StompService from '../../../../services/stomp_service.ts';
import {Status} from '../../../../core/constants/Status';
import {MessageModel} from '../../../../models/MessageModel';
import {authSelector} from '../../../redux/AuthReducer';
import SendMessage from './components/SendMessage';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from './components/BottomSheetComponent.tsx';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {DocumentPickerResponse} from 'react-native-document-picker';
import chatAPI from '../../../../services/chat_api.ts';
import {Styles} from '../../../../core/constants/Styles.ts';
import {Constants} from '../../../../core/constants/Constants.ts';
import {Format} from '../../../../core/utils/Format.ts';

const ChatScreen = ({navigation, route}: any) => {
  const {name, type} = route.params;
  const user = useSelector(authSelector).UserInfo;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mediaPicked, setMediaPicked] = useState<ImageOrVideo | undefined>(
    undefined,
  );
  const [filePicked, setFilePicked] = useState<
    DocumentPickerResponse | undefined
  >(undefined);
  const stompService = StompService.getInstance(user.UserName);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);

  const handleDotsPress = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.expand();
  };

  const handleNewMessage = useCallback((message: MessageModel) => {
    setMessages(prevMessages => [
      {
        message_id: message.message_id,
        message: message.message,
        senderName: message.senderName,
        time: message.time,
        fileUrl: message.fileUrl,
        fileType: message.fileType,
      },
      ...prevMessages,
    ]);
  }, []);

  const handleSendMessage = (message: string) => {
    let file = null;
    if (mediaPicked) {
      file = {
        uri: mediaPicked.path,
        type: mediaPicked.mime,
        name: mediaPicked.filename,
      };
    } else if (filePicked) {
      file = {
        uri: filePicked.uri,
        type: filePicked.type,
        name: filePicked.name,
      };
    }
    file
      ? chatAPI.HandleUpload(user.UserName, name, message, file)
      : stompService.sendMessagePublic({
          senderName: user.UserName,
          receiverName: name,
          message,
          status: Status.SENT,
        });
  };

  const fetchMoreMessages = async () => {
    if (loadingMore || !hasMoreMessages) {
      return;
    }

    setLoadingMore(true);
    try {
      const response: any = await chatAPI.HandleGetHistoryMessage(
        user.UserName,
        name,
        page,
      );

      if (response.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages(prevMessages => [...prevMessages, ...response]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderItem = ({item, index}: any) => {
    const currentMessageDate = item.time.toString().split(' ')[0];
    const nextMessageDate =
      index < messages.length - 1
        ? messages[index + 1].time.toString().split(' ')[0]
        : null;

    const showDateSeparator = currentMessageDate !== nextMessageDate;
    const showSenderName =
      index === 0 || messages[index - 1].senderName !== item.senderName;

    return (
      <>
        <MessageBubble
          key={item.message_id}
          message={item.message}
          senderName={item.senderName}
          showSenderName={showSenderName && type === 'group'}
          time={item.time.toString().split(' ')[1]}
          fileUrl={Constants.socketUrl + '/uploads/' + item.fileUrl?.split('\\').pop()}
          fileType={item.fileType}
        />
        {showDateSeparator && (
          <RowComponent style={styles.dateSeparator}>
            <View style={[Styles.flex, styles.line]} />
            <Text style={styles.dateText}>
              {Format.formatDate(currentMessageDate)}
            </Text>
            <View style={[Styles.flex, styles.line]} />
          </RowComponent>
        )}
      </>
    );
  };

  useEffect(() => {
    stompService.setOnMessageCallback(handleNewMessage);
  }, [stompService, handleNewMessage]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response: any = await chatAPI.HandleGetHistoryMessage(
          user.UserName,
          name,
          0,
        );
        setMessages(response);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory().catch(error =>
      console.error('Error in fetchChatHistory:', error),
    );
  }, [name, user.UserName]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeArea}>
        <HeaderChat navigation={navigation} name={name} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={Styles.flex}>
          <View style={[Styles.flex, styles.container]}>
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.message_id.toString()}
              onEndReached={fetchMoreMessages}
              onEndReachedThreshold={0.5}
              inverted
              refreshing={loadingMore}
              ListFooterComponent={
                loadingMore ? <ActivityIndicator size="large" /> : null
              }
            />
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
      <View style={Styles.flex} />
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
  container: {
    backgroundColor: AppColors.lightGrey,
    paddingHorizontal: 5,
  },
  dateSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: AppColors.greyIcon,
    marginHorizontal: 10,
  },
  line: {
    backgroundColor: AppColors.greyLine,
    height: 1,
  },
});

export default ChatScreen;
