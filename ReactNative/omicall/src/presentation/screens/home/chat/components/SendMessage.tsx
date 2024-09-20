import {useState} from 'react';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import * as DocumentPicker from 'react-native-document-picker';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  RowComponent,
  SpaceComponent,
  TextFieldComponent,
} from '../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {AppColors} from '../../../../../core/constants/AppColors.ts';
import {AppInfos} from '../../../../../core/constants/AppInfos.ts';

interface SendMessageProps {
  onSendMessage: (message: string, fileUrl: string, fileType: string) => void;
  onDotsPress: () => void;
  mediaPicked: ImageOrVideo | undefined;
  filePicked: DocumentPicker.DocumentPickerResponse | undefined;
  setMediaPicked: (media: ImageOrVideo | undefined) => void;
  setFilePicked: (
    file: DocumentPicker.DocumentPickerResponse | undefined,
  ) => void;
}

const SendMessage = (props: SendMessageProps) => {
  const {
    onSendMessage,
    onDotsPress,
    mediaPicked,
    filePicked,
    setMediaPicked,
    setFilePicked,
  } = props;
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const trimmedMessage = message.trimStart();
    setMessage('');
    setMediaPicked(undefined);
    setFilePicked(undefined);
    if (trimmedMessage || mediaPicked || filePicked) {
      const fileUrl = mediaPicked
        ? await handleUpload('media', mediaPicked)
        : filePicked
          ? await handleUpload('file', filePicked)
          : '';
      const fileType = mediaPicked ? 'media' : filePicked ? 'file' : '';
      onSendMessage(trimmedMessage, fileUrl, fileType);
    }
  };

  const handleUpload = async (
    type: 'media' | 'file',
    file: ImageOrVideo | DocumentPicker.DocumentPickerResponse,
  ): Promise<string> => {
    let fileName: string = '';
    let filePath: string = '';

    if ('name' in file && file.name) {
      fileName = `${file.name.split('.').shift()}-${Date.now()}.${file.name.split('.').pop()}`;
      filePath = file.uri; // DocumentPicker uses 'uri'
    } else if ('path' in file) {
      fileName = `${type}-${Date.now()}.${file.path.split('.').pop()}`;
      filePath = file.path; // ImagePicker uses 'path'
    } else {
      throw new Error('File format is not supported');
    }

    const path = `${type}s/${fileName}`;
    const reference = storage().ref(path);
    await reference.putFile(filePath);
    return await reference.getDownloadURL();
  };

  return (
    <RowComponent style={styles.rowChat}>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={onDotsPress}>
        <Entypo
          name={'dots-three-horizontal'}
          size={24}
          color={AppColors.secondary}
          style={styles.icon}
        />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TextFieldComponent
        placeholder={'Nhập tin nhắn...'}
        width={AppInfos.sizes.width * 0.75}
        styleContainer={styles.input}
        value={message}
        onChangeText={text => setMessage(text)}
        image={mediaPicked?.path}
        file={filePicked}
        onRemoveImage={() => setMediaPicked(undefined)}
        onRemoveFile={() => setFilePicked(undefined)}
        multiline={true}
        returnKeyType={'next'}
      />
      <SpaceComponent width={15} />
      <TouchableOpacity style={styles.flex} onPress={handleSend}>
        <Ionicons
          name={'send'}
          size={24}
          color={AppColors.secondary}
          style={styles.icon}
        />
      </TouchableOpacity>
    </RowComponent>
  );
};

const styles = StyleSheet.create({
  rowChat: {
    alignItems: 'flex-end',
  },
  input: {
    borderWidth: 0,
    backgroundColor: AppColors.lightGrey,
  },
  icon: {
    marginVertical: 15,
  },
  flex: {
    flex: 1,
  },
});

export default SendMessage;
