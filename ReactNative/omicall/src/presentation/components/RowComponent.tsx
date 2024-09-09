import {StyleProp, View, ViewStyle} from 'react-native';
import React from 'react';

interface RowComponentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const RowComponent = (props: RowComponentProps) => {
  return <View style={[styles.row, props.style]}>{props.children}</View>;
};

const styles = {
  row: {
    flexDirection: 'row' as 'row',
  },
};

export default RowComponent;
