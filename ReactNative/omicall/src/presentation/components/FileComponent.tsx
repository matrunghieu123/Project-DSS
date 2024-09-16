import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import * as DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../core/constants/AppColors.ts';
import DocumentIcon from '../../../assets/svg/DocumentIcon.tsx';
import {RowComponent} from './index.ts';
import {Fonts} from '../../core/constants/Fonts.ts';

interface FileComponentProps {
  file: DocumentPicker.DocumentPickerResponse;
  onRemoveFile?: () => void;
  allowRemove?: boolean;
}

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const FileComponent = (props: FileComponentProps) => {
  const {file, onRemoveFile} = props;
  return (
    <RowComponent style={styles.fileContainer}>
      <DocumentIcon style={styles.icon} />
      <View style={styles.flex}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.fileSize}>{formatFileSize(file.size ?? 0)}</Text>
      </View>
      {props.allowRemove && (
        <TouchableOpacity style={styles.closeButton} onPress={onRemoveFile}>
          <Icon name="close" size={12} color="white" />
        </TouchableOpacity>
      )}
    </RowComponent>
  );
};

const styles = StyleSheet.create({
  fileContainer: {
    width: 200,
    height: 60,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  fileName: {
    fontSize: 16,
    color: AppColors.black,
    fontFamily: Fonts.bold,
  },
  fileSize: {
    fontSize: 13,
    color: AppColors.greyIcon,
    fontFamily: Fonts.regular,
  },
  closeButton: {
    backgroundColor: AppColors.grey,
    borderRadius: 10,
    padding: 2,
    alignSelf: 'flex-start',
    margin: 5,
  },
  icon: {
    margin: 5,
  },
  flex: {
    flex: 1,
  },
});

export default FileComponent;
