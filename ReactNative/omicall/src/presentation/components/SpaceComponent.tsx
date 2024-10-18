import {StyleProp, View, ViewStyle} from 'react-native';
import React from 'react';

interface SpaceComponentProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const SpaceComponent = (props: SpaceComponentProps) => {
  const {width, height, style} = props;
  return <View style={[{width, height}, style]} />;
};

export default SpaceComponent;
