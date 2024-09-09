import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {AvatarCircle, RowComponent} from './index.ts';
import {Fonts} from '../../core/constants/Fonts.ts';
import {AppColors} from '../../core/constants/AppColors.ts';

interface ChatComponentProps {
  navigation: any;
  name: string;
  content: string;
}

const ChatComponent = (props: ChatComponentProps) => {
  const {navigation, name, content} = props;
  const handlePress = () => {
    navigation.navigate('ChatScreen');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <RowComponent>
        <AvatarCircle />
        <View style={styles.textContainer}>
          <RowComponent style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>Bây giờ</Text>
          </RowComponent>
          <Text style={styles.content}>{content}</Text>
        </View>
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 'auto',
    backgroundColor: 'white',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 15,
    paddingTop: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginVertical: 4,
  },
  content: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.grey,
  },
  row: {
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginVertical: 4,
    marginRight: 10,
    color: AppColors.grey,
  },
});

export default ChatComponent;
