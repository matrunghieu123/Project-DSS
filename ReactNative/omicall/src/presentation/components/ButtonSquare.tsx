import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';

interface Props {
  width?: number;
  height?: number;
  icon: ReactNode;
  onPress?: () => void;
  backgroundColor: string;
}

const ButtonSquare = (props: Props) => {
  const {width, height, icon, onPress, backgroundColor} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, {width: width || 45, height: height || 45}]}>
      <View style={[styles.background, {backgroundColor: backgroundColor}]} />
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    opacity: 0.15,
  },
});

export default ButtonSquare;
