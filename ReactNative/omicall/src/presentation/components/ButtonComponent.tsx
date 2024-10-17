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
  icon?: any;
  iconPosition?: 'left' | 'right';
}

const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    title,
    onPress,
    disabled,
    style,
    styleText,
    icon,
    iconPosition = 'right',
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <RowComponent>
        {iconPosition === 'left' && icon}
        <Text style={[styles.text, styleText]}>{title}</Text>
        {iconPosition === 'right' && icon}
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
