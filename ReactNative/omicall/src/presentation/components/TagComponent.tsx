import {Fonts} from '../../core/constants/Fonts.ts';
import {AppColors} from '../../core/constants/AppColors.ts';
import {StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {RowComponent} from './index.ts';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  content: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  close?: boolean;
}

const TagComponent = (props: Props) => {
  const {content, onPress, style, disabled, close} = props;
  return (
    <TouchableOpacity
      style={[styles.tagContainer, style]}
      onPress={onPress}
      disabled={disabled}>
      <RowComponent style={{alignItems: 'center'}}>
        <Text style={styles.tag}>{content}</Text>
        {close && (
          <AntDesign name="closecircle" size={20} color={AppColors.red} style={{marginLeft: 10}}/>
        )}
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: AppColors.greyLine,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
    marginRight: 10,
    marginVertical: 5,
  },
  tag: {
    color: AppColors.secondary,
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});

export default TagComponent;
