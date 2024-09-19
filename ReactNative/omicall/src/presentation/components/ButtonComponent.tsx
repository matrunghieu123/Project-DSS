import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import React from 'react';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';
import {RowComponent} from './index.ts';

interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  logo?: any;
}

const ButtonComponent = (props: ButtonComponentProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        props.disabled ? styles.buttonDisabled : styles.buttonEnabled,
        props.style,
      ]}
      onPress={props.onPress}
      disabled={props.disabled}>
      <RowComponent>
        <Text style={[styles.text, props.styleText]}>{props.title}</Text>
        {props.logo}
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '80%',
    height: 58,
    backgroundColor: AppColors.primary,
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonEnabled: {
    opacity: 1,
  },
});
export default ButtonComponent;
