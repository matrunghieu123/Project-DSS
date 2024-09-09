import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {Constants} from '../../core/constants/Constants.ts';

interface AvatarCircleProps {
  image?: string;
}

const AvatarCircle = (props: AvatarCircleProps) => {
  return (
    <Image
      source={{
        uri: props.image
          ? props.image
          : Constants.avatarDefaultUrl,
      }}
      style={styles.avatar}
    />
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 12,
    marginHorizontal: 20,
  },
});
export default AvatarCircle;
