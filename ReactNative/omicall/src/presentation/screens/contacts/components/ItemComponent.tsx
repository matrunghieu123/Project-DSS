import {Fonts} from '../../../../core/constants/Fonts.ts';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RowComponent} from '../../../components/index.ts';
import {AppColors} from '../../../../core/constants/AppColors.ts';
import {AvatarCircle, ButtonSquare} from '../../../components';
import {Styles} from '../../../../core/constants/Styles.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  CallScreen: {phoneNumber: string};
};

interface ItemComponentProps {
  name: string;
  phoneNumber: string;
  onPress: () => void;
  image?: string;
}

const ItemComponent = (props: ItemComponentProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const makeCall = () => {
    navigation.navigate('CallScreen', {
      phoneNumber: props.phoneNumber,
    });
  };

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[Styles.boxShadow, styles.container]}>
      <RowComponent style={{alignItems: 'center'}}>
        <AvatarCircle image={props.image} />
        <View style={{marginLeft: 10}}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.phoneNumber}>{props.phoneNumber}</Text>
        </View>
        <View style={Styles.flex} />
        <ButtonSquare
          icon={
            <MaterialIcons
              name={'phone'}
              size={24}
              color={AppColors.secondary}
            />
          }
          backgroundColor={AppColors.greyLine}
          onPress={makeCall}
        />
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '3%',
    backgroundColor: AppColors.white,
    marginVertical: '1.5%',
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: AppColors.secondary,
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.black,
  },
});

export default ItemComponent;
