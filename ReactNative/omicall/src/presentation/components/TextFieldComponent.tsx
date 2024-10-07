import {
  Image,
  KeyboardType,
  ReturnKeyType,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {forwardRef, ReactNode, Ref, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'react-native-document-picker';
import {AppColors} from '../../core/constants/AppColors';
import {FileComponent} from './index.ts';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  media?: ImageOrVideo;
  file?: DocumentPicker.DocumentPickerResponse;
  onRemoveImage?: () => void;
  onRemoveFile?: () => void;
}

const TextFieldComponent = forwardRef(
  (props: InputComponentProps, ref: Ref<TextInput>) => {
    const [isSecure, setIsSecure] = useState(props.secureTextEntry || false);
    const [thumbnail, setThumbnail] = useState<string>('');

    const handlePress = () => {
      if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as React.RefObject<TextInput>).current?.focus();
      }
    };

    useEffect(() => {
      if (props.media && props.media.mime.startsWith('image/')) {
        setThumbnail(props.media.path);
      } else if (props.media && props.media.mime.startsWith('video/')) {
        createThumbnail({
          url: props.media.path,
        }).then(response => {
          setThumbnail(response.path);
        });
      }
    }, [props.media]);

    return (
      <View style={[styles.container, props.styleContainer]}>
        {props.media && thumbnail !== '' && (
          <View style={styles.imageContainer}>
            <Image source={{uri: thumbnail}} style={styles.image} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={props.onRemoveImage}>
              <Icon name="close" size={14} color="white" />
            </TouchableOpacity>
            {props.media?.mime.startsWith('video/') && (
              <Ionicons
                name={'play-circle'}
                size={36}
                color={AppColors.greyLine}
                style={styles.playIcon}
              />
            )}
          </View>
        )}
        {props.file && (
          <FileComponent
            file={props.file}
            onRemoveFile={props.onRemoveFile}
            allowRemove={true}
          />
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
    fontSize: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: AppColors.grey,
    borderRadius: 10,
    padding: 2,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  playIcon: {
    position: 'absolute',
  }
});

export default TextFieldComponent;
