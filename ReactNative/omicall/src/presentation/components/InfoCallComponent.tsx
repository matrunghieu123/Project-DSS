import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Styles} from '../../core/constants/Styles.ts';
import {AvatarCircle, RowComponent} from './index.ts';
import {Fonts} from '../../core/constants/Fonts.ts';
import {AppColors} from '../../core/constants/AppColors.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface InfoCallComponentProps {
  name: string;
  phoneNumber: string;
  time: string;
  status: string;
  answered: boolean;
  hasNote: boolean;
  onPress?: () => void;
}

const InfoCallComponent = (props: InfoCallComponentProps) => {
  const {name, phoneNumber, time, status, answered, hasNote, onPress} = props;
  return (
    <TouchableOpacity
      style={[Styles.boxShadow, styles.container]}
      onPress={onPress}>
      <RowComponent style={styles.row}>
        <AvatarCircle />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{phoneNumber}</Text>
        </View>
        <View style={Styles.flex} />
        <Text style={styles.time}>{time}</Text>
      </RowComponent>
      <View style={Styles.flex} />
      <RowComponent style={{alignItems: 'center'}}>
        <MaterialIcons
          name="phone-forwarded"
          size={22}
          color={answered ? AppColors.green : AppColors.red}
        />
        <Text style={styles.status}>
          {status} / {answered ? 'Trả lời' : 'Không trả lời'}
        </Text>
        <View style={Styles.flex}/>
        {
          hasNote && <MaterialCommunityIcons name="note-text" size={22} color={AppColors.greyIcon} />
        }
      </RowComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    aspectRatio: 3.7,
    backgroundColor: AppColors.white,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  infoContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginVertical: 4,
    color: AppColors.black,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.light,
    color: AppColors.black,
  },
  time: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginVertical: 4,
    color: AppColors.grey,
  },
  status: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: AppColors.greyIcon,
    marginLeft: 5,
  },
});

export default InfoCallComponent;
