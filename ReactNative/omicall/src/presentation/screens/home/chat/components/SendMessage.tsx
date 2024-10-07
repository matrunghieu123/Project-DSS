import {useState} from 'react';
import {ImageOrVideo} from 'react-native-image-crop-picker';
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
import {Styles} from '../../../../../core/constants/Styles.ts';

interface SendMessageProps {
  onSendMessage: (
    message: string,
    mediaPicked: ImageOrVideo | undefined,
    filePicked: DocumentPicker.DocumentPickerResponse | undefined,
  ) => void;
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
    const trimmedMessage = message.trim();
    setMessage('');
    setMediaPicked(undefined);
    setFilePicked(undefined);
    if (trimmedMessage || mediaPicked || filePicked) {
      onSendMessage(trimmedMessage, mediaPicked, filePicked);
    }
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
        media={mediaPicked}
        file={filePicked}
        onRemoveImage={() => setMediaPicked(undefined)}
        onRemoveFile={() => setFilePicked(undefined)}
        multiline={true}
        returnKeyType={'next'}
      />
      <SpaceComponent width={15} />
      <TouchableOpacity style={Styles.flex} onPress={handleSend}>
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
});

export default SendMessage;
