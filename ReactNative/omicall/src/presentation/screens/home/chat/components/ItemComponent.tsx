import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {RowComponent} from '../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../../../../../core/constants/AppColors.ts';
import {Fonts} from '../../../../../core/constants/Fonts.ts';

interface ItemComponentProps {
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
}

const ItemComponent = (props: ItemComponentProps) => {
  const {icon, title, description, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <RowComponent>
        <View style={styles.container}>
          <View style={styles.background} />
          <Ionicons name={icon} size={24} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.line} />
        </View>
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.grey,
    borderRadius: 15,
    opacity: 0.3,
  },
  title: {
    fontFamily: Fonts.medium,
    color: AppColors.secondary,
    fontSize: 16,
    marginBottom: 3,
  },
  description: {
    fontFamily: Fonts.regular,
    color: 'gray',
    fontSize: 13,
  },
  line: {
    height: 1,
    backgroundColor: AppColors.greyLine,
    marginVertical: 10,
  },
  flex: {
    flex: 1,
  },
});

export default ItemComponent;
