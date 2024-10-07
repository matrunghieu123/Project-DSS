import React, {FC, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Styles} from '../../../core/constants/Styles.ts';
import {RowComponent} from '../../components';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {Fonts} from '../../../core/constants/Fonts.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Sound from 'react-native-sound';

const CustomKeyboard: FC<{navigation: any}> = ({navigation}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const [inputValue, setInputValue] = useState('');
  const textInputRef = React.useRef<TextInput>(null);

  Sound.setCategory('Playback');

  const playSound = () => {
    const sound = new Sound('dtmf.wav', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Error loading sound: ', error);
        return;
      }
      sound.play(() => {
        sound.release();
      });
    });
  };

  const handleKeyPress = (key: string) => {
    textInputRef.current?.focus();
    setInputValue(prev => prev + key);
    playSound();
  };

  const handleDeletePress = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleLongPress = (key: string) => {
    if (key === '0') {
      textInputRef.current?.focus();
      setInputValue(prev => prev + '+');
      playSound();
    }
  };

  return (
    <View style={[Styles.flex, styles.keyboardContainer]}>
      <RowComponent style={styles.inputRow}>
        <TextInput
          placeholder={'Nhập số điện thoại'}
          style={[styles.input, Styles.flex]}
          value={inputValue}
          showSoftInputOnFocus={false}
          ref={textInputRef}
        />
        <AddContactButton navigation={navigation} />
      </RowComponent>
      <RowComponent style={styles.keyboard}>
        {keys.map(key => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handleKeyPress(key)}
            onLongPress={() => handleLongPress(key)}
            delayLongPress={500}>
            <Text style={styles.keyText}>{key}</Text>
            {key === '0' && <Text style={styles.plusText}>+</Text>}
          </TouchableOpacity>
        ))}
      </RowComponent>
      <RowComponent style={styles.bottomRow}>
        <SettingButton />
        <CallButton />
        <DeleteButton onPress={handleDeletePress} />
      </RowComponent>
    </View>
  );
};

const AddContactButton: FC<{navigation: any}> = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
      <View style={styles.addButton}>
        <MaterialIcons name="person-add" size={24} color={AppColors.green} />
      </View>
    </TouchableOpacity>
  );
};

const SettingButton: FC = () => {
  return (
    <TouchableOpacity
      style={[styles.addButton, {backgroundColor: AppColors.lightGrey}]}>
      <Ionicons name="settings-sharp" size={24} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const CallButton: FC = () => {
  return (
    <TouchableOpacity style={[styles.callButton]}>
      <FontAwesome6 name="phone" size={26} color={AppColors.white} />
    </TouchableOpacity>
  );
};

const DeleteButton: FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.addButton, {backgroundColor: AppColors.lightGrey}]}
      onPress={onPress}>
      <FontAwesome6 name="delete-left" size={24} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: AppColors.white,
  },
  input: {
    fontSize: 26,
    fontFamily: Fonts.bold,
  },
  addButton: {
    backgroundColor: AppColors.lightGreen,
    borderRadius: 15,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  keyboard: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    padding: 10,
  },
  key: {
    width: '30%',
    margin: 5,
    padding: 10,
    backgroundColor: AppColors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  keyText: {
    fontSize: 24,
    color: AppColors.secondary,
    fontFamily: Fonts.bold,
  },
  plusText: {
    fontSize: 16,
    color: AppColors.secondary,
    fontFamily: Fonts.bold,
    position: 'absolute',
    bottom: -2,
  },
  bottomRow: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomKeyboard;
