import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppColors} from '../../../../core/constants/AppColors.ts';
import {Fonts} from '../../../../core/constants/Fonts.ts';

interface TabComponentProps {
  name: string;
  active?: boolean;
  onPress?: () => void;
}

const TabComponent = (props: TabComponentProps) => {
  const {name, active, onPress} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {backgroundColor: active ? AppColors.secondary : AppColors.background},
      ]}>
      <Text
        style={[
          styles.text,
          {color: active ? AppColors.white : AppColors.secondary},
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 7,
    marginRight: 10,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});

export default TabComponent;
