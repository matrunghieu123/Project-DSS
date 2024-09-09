import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Fonts} from '../../core/constants/Fonts';

const TabLabel = ({iconName, label, color}: {iconName: string; label: string; color: string}) => {
  return (
    <View style={styles.labelContainer}>
      <MaterialIcons name={iconName} size={17} color={color} />
      <Text style={[styles.labelText, {color}]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
});

export default TabLabel;
