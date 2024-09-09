import {View} from 'react-native';
import React from 'react';

interface SpaceComponentProps {
  width?: number;
  height?: number;
}

const SpaceComponent = (props: SpaceComponentProps) => {
  const {width, height} = props;
  return (
    <View style={{width, height}}/>
  );
};

export default SpaceComponent;
