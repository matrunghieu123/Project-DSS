import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Styles} from '../../../core/constants/Styles.ts';
import {AppColors} from '../../../core/constants/AppColors.ts';
import {InfoCallComponent, TopContainer} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../../../core/constants/Fonts.ts';
import modelsAPI from '../../../services/models_api.ts';
import LoadingModal from '../../modal/LoadingModal.tsx';
import BottomSheetInfoCall from './BottomSheetInfoCall.tsx';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Record} from '../../../models/HistoryCallModel.ts';
import moment from 'moment';

const HistoryScreen: FC<{navigation: any}> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await modelsAPI.getHistoryCall();
      setHistory(response.records);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({item}: any) => {
    const time = moment(item.EndTime).format('HH:mm');
    const status =
      item.Direction === 'outbound' ? 'Cuộc gọi đi' : 'Cuộc gọi đến';
    return (
      <InfoCallComponent
        name={item.CustomerName}
        phoneNumber={item.callerNumber}
        time={time}
        status={status}
        answered={item.totalDuration}
        hasNote={item.Tag || item.Note}
        onPress={() => {
          setSelectedRecord(item);
          bottomSheetRef.current?.snapToIndex(0);
        }}
      />
    );
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={Styles.flex}>
      <LoadingModal visible={loading} />
      <TopContainer navigation={navigation} />
      <View style={[Styles.flex, styles.container]}>
        <View style={[Styles.boxShadow, styles.box]}>
          <Text style={styles.title}>Lịch sử cuộc gọi</Text>
          <SearchButton navigation={navigation} />
          <FilterButton navigation={navigation} />
        </View>
        <FlatList
          style={{width: '100%'}}
          contentContainerStyle={styles.container}
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.CM_Call_ID.toString()}
          ListFooterComponent={<View style={{height: 100}} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <BottomSheetInfoCall
        bottomSheetRef={bottomSheetRef}
        record={selectedRecord as Record}
        fetchData={fetchData}
      />
    </GestureHandlerRootView>
  );
};

const SearchButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => navigation.navigate('SearchScreen')}>
      <Ionicons name="search" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const FilterButton = ({navigation}: any) => {
  return (
    <TouchableOpacity
      style={styles.filterContainer}
      onPress={() => navigation.navigate('FilterScreen')}>
      <Ionicons name="filter" size={23} color={AppColors.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  box: {
    width: '95%',
    aspectRatio: 5,
    backgroundColor: AppColors.white,
    borderRadius: 15,
    marginTop: 10,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: AppColors.black,
  },
  searchContainer: {
    backgroundColor: AppColors.transparent,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: 65,
    top: 15,
  },
  filterContainer: {
    backgroundColor: AppColors.transparent,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: 15,
    top: 15,
  },
  dateSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  dateText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: AppColors.greyIcon,
    marginHorizontal: 10,
  },
  line: {
    backgroundColor: AppColors.greyLine,
    height: 1,
  },
});

export default HistoryScreen;
