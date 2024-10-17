import React, {RefObject, useEffect, useState} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Styles} from '../../../core/constants/Styles';
import {
  Alert,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Fonts} from '../../../core/constants/Fonts';
import {AppColors} from '../../../core/constants/AppColors';
import {Record} from '../../../models/HistoryCallModel';
import {
  AvatarCircle,
  ButtonComponent,
  ButtonSquare,
  RowComponent,
  SpaceComponent,
  TagComponent,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {bottomTabRef} from '../../navigators/BottomTabNavigator';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import modelsAPI from '../../../services/models_api.ts';

interface Props {
  bottomSheetRef: RefObject<BottomSheet>;
  record: Record;
  fetchData: () => Promise<void>;
}

const BottomSheetInfoCall = ({bottomSheetRef, record, fetchData}: Props) => {
  const [snapPoints, setSnapPoints] = useState(['35%', '85%', '100%']);
  const [indexSheet, setIndexSheet] = useState(-1);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const status =
    record?.Direction === 'outbound' ? 'Cuộc gọi đi' : 'Cuộc gọi đến';

  const backdrop = (backdropProps: any) => (
    <BottomSheetBackdrop
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  useEffect(() => {
    indexSheet <= 0 ? setIsOpenEdit(false) : setIsOpenEdit(true);
  }, [indexSheet]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let baseSnapPoint = 35;
      if (record?.Tag) baseSnapPoint += 10;
      if (record?.Note) baseSnapPoint += 10;
      setSnapPoints([`${baseSnapPoint}%`, '85%', '100%']);
    });
  }, [record]);

  return (
    <BottomSheet
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      index={-1}
      backdropComponent={backdrop}
      onAnimate={(_, toIndex) => {
        setIndexSheet(toIndex);
        bottomTabRef.current?.setVisible(toIndex === -1);
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={Styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BottomSheetView style={[Styles.flex, styles.container]}>
            {record && (
              <SafeAreaView>
                <Header
                  record={record}
                  bottomSheetRef={bottomSheetRef}
                  isOpenEdit={isOpenEdit}
                  setIsOpenEdit={setIsOpenEdit}
                />
                <SpaceComponent height={10} />
                <RowComponent style={styles.row}>
                  <AvatarCircle />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{record.CustomerName}</Text>
                    <Text style={styles.description}>
                      {record.callerNumber}
                    </Text>
                  </View>
                  <View style={Styles.flex} />
                  <Text style={styles.time}>
                    {moment(record.EndTime).format('HH:mm DD/MM/YYYY')}
                  </Text>
                </RowComponent>
                <SpaceComponent height={20} />
                <RowComponent style={styles.centeredRow}>
                  <MaterialIcons
                    name="phone-forwarded"
                    size={22}
                    color={
                      record.totalDuration ? AppColors.green : AppColors.red
                    }
                  />
                  <Text style={styles.status}>
                    {status} /{' '}
                    {record.totalDuration ? 'Trả lời' : 'Không trả lời'}
                  </Text>
                </RowComponent>
                {indexSheet >= 1 ? (
                  <EditInfo
                    record={record}
                    bottomSheetRef={bottomSheetRef}
                    fetchData={fetchData}
                  />
                ) : (
                  <DefaultInfo record={record} />
                )}
              </SafeAreaView>
            )}
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const Header = ({
  record,
  bottomSheetRef,
  isOpenEdit,
  setIsOpenEdit,
}: {
  record: Record;
  bottomSheetRef: RefObject<BottomSheet>;
  isOpenEdit: boolean;
  setIsOpenEdit: (value: boolean) => void;
}) => (
  <RowComponent style={styles.row}>
    <View>
      <Text style={styles.title}>Chi tiết cuộc gọi</Text>
      <Text style={styles.id} numberOfLines={1}>
        {record.callID}
      </Text>
    </View>
    <RowComponent>
      <ButtonSquare
        icon={<Ionicons name="copy" size={20} color={AppColors.secondary} />}
        backgroundColor={AppColors.grey}
        onPress={() => {
          Clipboard.setString(record.callID);
          Alert.alert('Thông báo', 'Mã cuộc gọi đã được sao chép');
        }}
      />
      <SpaceComponent width={10} />
      <ButtonSquare
        icon={<FontAwesome5 name="pen" size={20} color={AppColors.secondary} />}
        backgroundColor={AppColors.grey}
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(isOpenEdit ? 0 : 1);
          setIsOpenEdit(!isOpenEdit);
        }}
      />
    </RowComponent>
  </RowComponent>
);
const DefaultInfo = ({record}: {record: Record}) => {
  return (
    <>
      <SpaceComponent height={5} />
      {record.Tag && (
        <View>
          <Text style={styles.name}>Tag</Text>
          <RowComponent style={{flexWrap: 'wrap'}}>
            {/*{selectedTag.map((tag, index) => (*/}
            <TagComponent content={record.Tag} disabled />
            {/*))}*/}
          </RowComponent>
        </View>
      )}
      {record.Note && (
        <View>
          <Text style={styles.name}>Ghi chú</Text>
          <Text style={styles.description} numberOfLines={3}>
            {record.Note}
          </Text>
        </View>
      )}
      <ButtonComponent
        title="Gọi lại"
        onPress={() => {}}
        style={styles.callButton}
        icon={
          <Ionicons name="call" size={20} color="white" style={styles.icon} />
        }
        iconPosition="left"
      />
    </>
  );
};

const EditInfo = ({
  record,
  bottomSheetRef,
  fetchData,
}: {
  record: Record;
  bottomSheetRef: RefObject<BottomSheet>;
  fetchData: () => Promise<void>;
}) => {
  const [selectedTag, setSelectedTag] = useState<string[]>(
    record.Tag ? [record.Tag] : [],
  );
  const [valueNote, setValueNote] = useState(record.Note);

  const handleUpdate = async () => {
    try {
      await modelsAPI.updateTagNoteCall(
        record.CM_Call_ID,
        selectedTag[0],
        valueNote,
      );
      Alert.alert('Thông báo', 'Cập nhật thành công');
      await fetchData();
      bottomSheetRef.current?.close();
    } catch (e) {
      console.log('Error: ', e);
      Alert.alert('Thông báo', 'Cập nhật thất bại');
    }
  };

  return (
    <View>
      <Text style={styles.name}>Tag</Text>
      <TagInput selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <Text style={styles.name}>Ghi chú cuộc gọi</Text>
      <BottomSheetTextInput
        value={valueNote}
        onChangeText={setValueNote}
        style={[styles.tagContainer, styles.noteInput]}
        multiline
      />
      <ButtonComponent
        title="Cập nhật"
        onPress={handleUpdate}
        style={[styles.callButton, {backgroundColor: AppColors.green}]}
      />
    </View>
  );
};

const TagInput = ({
  selectedTag,
  setSelectedTag,
}: {
  selectedTag: string[];
  setSelectedTag: (tags: string[]) => void;
}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.tagContainer}
      onPress={() =>
        navigation.navigate('ChooseTagScreen', {
          tag: selectedTag,
          setTag: setSelectedTag,
        })
      }>
      {selectedTag.length > 0 ? (
        <RowComponent style={{flexWrap: 'wrap'}}>
          {selectedTag.map((tag, index) => (
            <TagComponent key={index} content={tag} disabled />
          ))}
        </RowComponent>
      ) : (
        <Text style={styles.nothing}>Chưa có dữ liệu</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: AppColors.secondary,
  },
  id: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: AppColors.grey,
    marginTop: 5,
  },
  infoContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginVertical: 4,
    color: AppColors.secondary,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.light,
    color: AppColors.secondary,
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
  callButton: {
    width: '100%',
    backgroundColor: AppColors.secondary,
  },
  icon: {
    marginRight: 10,
  },
  centeredRow: {
    alignItems: 'center',
  },
  tagContainer: {
    width: '100%',
    backgroundColor: AppColors.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.greyLine,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  nothing: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: AppColors.grey,
    marginVertical: 15,
  },
  noteInput: {
    fontFamily: Fonts.regular,
    color: AppColors.secondary,
    aspectRatio: 3,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});

export default BottomSheetInfoCall;
