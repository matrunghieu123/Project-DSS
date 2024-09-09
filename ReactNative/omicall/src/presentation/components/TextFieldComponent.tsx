import {StyleSheet, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {forwardRef, ReactNode, Ref, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../core/constants/AppColors';

interface InputComponentProps {
  value?: string;
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  height?: number;
  width?: number;
  style?: any;
  styleContainer?: ViewStyle;
  maxLength?: number;
  onKeyPress?: (event: any) => void;
  onSubmitEditing?: () => void;
  multiline?: boolean;
}

const TextFieldComponent = forwardRef(
  (props: InputComponentProps, ref: Ref<TextInput>) => {
    const [isSecure, setIsSecure] = useState(props.secureTextEntry || false);

    const handlePress = () => {
      if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as React.RefObject<TextInput>).current?.focus();
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            width: props.width || '100%',
            height: props.height || 56,
          },
          props.styleContainer,
        ]}
        onPress={handlePress}
        activeOpacity={1}>
        {props.prefix && <View style={styles.prefix}>{props.prefix}</View>}
        <TextInput
          ref={ref}
          value={props.value}
          placeholder={props.placeholder}
          onChangeText={text => props.onChangeText && props.onChangeText(text)}
          secureTextEntry={isSecure}
          keyboardType={props.keyboardType || 'default'}
          returnKeyType={props.returnKeyType || 'done'}
          style={[styles.textInput, props.style]}
          autoCapitalize={props.autoCapitalize || 'none'}
          maxLength={props.maxLength}
          onKeyPress={props.onKeyPress}
          onSubmitEditing={props.onSubmitEditing}
          multiline={props.multiline}
        />
        {props.suffix && <View style={styles.suffix}>{props.suffix}</View>}
        {props.secureTextEntry && (
          <View>
            <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
              <Icon
                name={isSecure ? 'visibility' : 'visibility-off'}
                style={[styles.suffix, styles.icon]}
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: AppColors.grey,
    borderWidth: 1,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  prefix: {
    marginLeft: 15,
  },
  suffix: {
    marginRight: 15,
  },
  icon: {
    fontSize: 20,
    color: AppColors.greyIcon,
  },
});

export default TextFieldComponent;
