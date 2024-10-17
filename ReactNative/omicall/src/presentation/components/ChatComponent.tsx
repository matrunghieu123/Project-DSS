import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {AvatarCircle, RowComponent, SpaceComponent} from './index.ts';
import {Fonts} from '../../core/constants/Fonts.ts';
import {AppColors} from '../../core/constants/AppColors.ts';
import {Styles} from '../../core/constants/Styles.ts';

interface ChatComponentProps {
  navigation: any;
  name: string;
  content: string;
  type: 'group' | 'private';
}

const ChatComponent = (props: ChatComponentProps) => {
  const {navigation, name, content, type} = props;
  const handlePress = () => {
    navigation.navigate('ChatScreen', {
      name,
      type,
    });
  };

  return (
    <TouchableOpacity
      style={[Styles.boxShadow, styles.container]}
      onPress={handlePress}>
      <RowComponent>
        <AvatarCircle style={{width: 50, height: 50}}/>
        <SpaceComponent width={10} />
        <View style={Styles.flex}>
          <RowComponent style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
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
    backgroundColor: AppColors.white,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    color: AppColors.grey,
  },
});

export default ChatComponent;
