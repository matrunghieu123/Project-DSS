import {
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AvatarCircle,
  MessageBubble,
  RowComponent,
  SpaceComponent,
  TextFieldComponent,
} from '../../../components';
import {Fonts} from '../../../../core/constants/Fonts';
import {AppColors} from '../../../../core/constants/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AppInfos} from '../../../../core/constants/AppInfos';
import StompService from '../../../../services/StompService.ts';
import {Status} from '../../../../core/constants/Status.ts';
import {MessageModel} from '../../../../models/MessageModel.ts';

const ChatScreen = ({navigation, route}: any) => {
  const {name, type} = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    return () => interactionPromise.cancel();
  }, [messages]);

  useEffect(() => {
    StompService.connect();
    StompService.setOnMessageCallback(handleNewMessage);

    const joinChatRoom = () => {
      if (StompService.isConnected()) {
        StompService.joinChatRoom({
          senderName: 'Quang Anh',
          status: Status.JOIN,
        });
      } else {
        console.warn('STOMP connection not established');
      }
    };

    joinChatRoom();
  }, []);

  const handleSendMessage = (message: string) => {
    const newMessage = {id: messages.length + 1, text: message, isSent: true};
    setMessages([...messages, newMessage]);
    if (type === 'telegram') {
      StompService.sendMessagePublic({
        senderName: 'Quang Anh',
        message,
        status: Status.MESSAGE,
      });
    }
  };
  const handleNewMessage = (message: MessageModel) => {
    if (message.senderName !== 'Quang Anh') {
    setMessages(prevMessages => [
      ...prevMessages,
      {id: prevMessages.length + 1, text: message.message, isSent: false},
    ]);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderChat navigation={navigation} name={name} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
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
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg.text}
                isSent={msg.isSent}
              />
            ))}
          </ScrollView>
        </View>
        <SendMessage onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const SendMessage = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState('');
  const handleSend = () => {
    const trimmedMessage = message.trimStart();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  return (
    <RowComponent style={[styles.row]}>
      <SpaceComponent width={10} />
      <TextFieldComponent
        placeholder={'Nhập tin nhắn...'}
        height={40}
        width={AppInfos.sizes.width * 0.85}
        styleContainer={styles.input}
        value={message}
        onChangeText={text => setMessage(text)}
      />
      <SpaceComponent width={15} />
      <TouchableOpacity style={styles.flex} onPress={handleSend}>
        <Ionicons name={'send'} size={24} color={AppColors.secondary} />
      </TouchableOpacity>
    </RowComponent>
  );
};

const HeaderChat = ({navigation, name}: any) => {
  return (
    <RowComponent style={[styles.row, styles.header]}>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 30,
  },
  row: {
    alignItems: 'center',
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
  input: {
    borderWidth: 0,
    backgroundColor: AppColors.lightGrey,
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
