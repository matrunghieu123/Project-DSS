import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  InteractionManager,
} from 'react-native';
import React, {useRef, useEffect, useMemo} from 'react';
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

const ChatScreen = ({navigation}: any) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const messages = useMemo(() => [
    {id: 1, text: 'Hey, how’s it going?', isSent: true},
    {id: 2, text: 'I’m good! How about you?', isSent: false},
    {id: 3, text: 'I’m doing well, thanks!', isSent: true},
    {id: 4, text: 'What are you up to today?', isSent: true},
    {id: 5, text: 'Just working on some projects. You?', isSent: false},
    {id: 6, text: 'Same here! Lots to do!', isSent: true},
    {id: 7, text: 'Do you have time to meet later?', isSent: false},
    {
      id: 8,
      text: 'Yeah, I’m free after 5. Where do you want to meet?',
      isSent: true,
    },
    {id: 9, text: 'How about that new coffee shop?', isSent: false},
    {id: 10, text: 'Sounds good! See you there.', isSent: true},
    {id: 11, text: 'Can you help me with something?', isSent: false},
    {id: 12, text: 'Sure, what do you need?', isSent: true},
    {id: 13, text: 'I’m having trouble with this project.', isSent: false},

  ], []);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    return () => interactionPromise.cancel();
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderChat navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <View style={[styles.flex, {backgroundColor: AppColors.lightGrey}]}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
            onLayout={() => scrollViewRef.current?.scrollToEnd({animated: true})}>
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg.text}
                isSent={msg.isSent}
              />
            ))}
          </ScrollView>
        </View>
        <SendMessage />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const SendMessage = () => {
  return (
    <RowComponent style={[styles.row]}>
      <SpaceComponent width={15} />
      <TextFieldComponent
        placeholder={'Nhập tin nhắn...'}
        height={40}
        width={AppInfos.sizes.width * 0.85}
        styleContainer={styles.input}
      />
      <SpaceComponent width={10} />
      <TouchableOpacity>
        <Ionicons name={'send'} size={24} color={AppColors.secondary} />
      </TouchableOpacity>
    </RowComponent>
  );
};

const HeaderChat = ({navigation}: any) => {
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
        <Text style={styles.name}>Quang Anh</Text>
        <Text style={styles.online}>Đang hoạt động</Text>
      </View>
      <View style={styles.flexSpacer} />
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
  flexSpacer: {
    flex: 1,
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
