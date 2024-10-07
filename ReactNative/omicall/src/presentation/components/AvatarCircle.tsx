import {Image, ImageStyle, StyleProp, StyleSheet} from 'react-native';
import React from 'react';
import {Constants} from '../../core/constants/Constants.ts';

interface AvatarCircleProps {
  image?: string;
  style?: StyleProp<ImageStyle>;
}

const AvatarCircle = (props: AvatarCircleProps) => {
  return (
    <Image
      source={{
        uri: props.image
          ? props.image
          : Constants.avatarDefaultUrl,
      }}
      style={[styles.avatar, props.style]}
    />
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
export default AvatarCircle;
