import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts';

interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const ButtonComponent = (props: ButtonComponentProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        props.disabled ? styles.buttonDisabled : styles.buttonEnabled,
      ]}
      disabled={props.disabled}>
      <Text style={styles.text}>{props.title}</Text>
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
