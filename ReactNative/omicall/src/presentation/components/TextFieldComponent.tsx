import {
  Image, KeyboardType, ReturnKeyType,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {forwardRef, ReactNode, Ref, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../core/constants/AppColors';

interface InputComponentProps {
  value?: string;
  placeholder?: string;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  width?: number;
  height?: number;
  style?: any;
  styleContainer?: ViewStyle;
  maxLength?: number;
  onKeyPress?: (event: any) => void;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  image?: string;
  onRemoveImage?: () => void;
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
      <View style={[styles.container, props.styleContainer]}>
        {props.image && (
          <View style={styles.imageContainer}>
            <Image source={{uri: props.image}} style={styles.image} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={props.onRemoveImage}>
              <Icon name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.inputContainer,
            {
              width: props.width || '100%',
              height: props.height || null,
            },
          ]}
          onPress={handlePress}
          activeOpacity={1}>
          {props.prefix && <View style={styles.prefix}>{props.prefix}</View>}
          <TextInput
            ref={ref}
            value={props.value}
            placeholder={props.placeholder}
            onChangeText={text =>
              props.onChangeText && props.onChangeText(text)
            }
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
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderColor: AppColors.grey,
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: AppColors.lightGrey,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  imageContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    marginTop: 10,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: AppColors.grey,
    borderRadius: 10,
    padding: 2,
  },
});

export default TextFieldComponent;
