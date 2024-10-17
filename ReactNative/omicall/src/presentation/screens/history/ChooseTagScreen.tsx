import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {AppColors} from '../../../core/constants/AppColors';
import {Styles} from '../../../core/constants/Styles';
import {Fonts} from '../../../core/constants/Fonts';
import {
  ButtonComponent,
  ButtonSquare,
  RowComponent,
  SpaceComponent,
  TagComponent,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Constants} from '../../../core/constants/Constants';

const ChooseTagScreen = ({route, navigation}: any) => {
  const {tag, setTag} = route.params;
  const [selectedTag, setSelectedTag] = useState<string[]>(tag);
  const handleTagSelect = (tag: string) => {
    setSelectedTag(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag],
    );
  };

  return (
    <SafeAreaView style={[Styles.flex, {backgroundColor: AppColors.white}]}>
      <View style={[Styles.flex, styles.container]}>
        <RowComponent style={styles.row}>
          <Text style={styles.title}>Tag được chọn ({selectedTag.length})</Text>
          {selectedTag.length > 0 && (
            <Text style={styles.uncheck} onPress={() => setSelectedTag([])}>
              Bỏ chọn tất cả
            </Text>
          )}
        </RowComponent>
        {selectedTag.length === 0 && (
          <Text style={[styles.uncheck, {marginTop: 15}]}>Chưa có dữ liệu</Text>
        )}
        <RowComponent style={styles.rowTag}>
          {selectedTag.map((tag, index) => (
            <TagComponent
              key={index}
              content={tag}
              onPress={() => handleTagSelect(tag)}
              close
            />
          ))}
        </RowComponent>
        <SpaceComponent height={10} />
        <View style={styles.line} />
        <RowComponent style={styles.row}>
          <View>
            <Text style={[styles.title, {marginVertical: 5}]}>Tag</Text>
            <Text style={[styles.uncheck, {fontSize: 13}]}>
              {Constants.TAG.length} giá trị
            </Text>
          </View>
          <ButtonSquare
            icon={
              <Ionicons name="search" size={23} color={AppColors.secondary} />
            }
            backgroundColor={AppColors.greyLine}
          />
        </RowComponent>
        <RowComponent style={styles.rowTag}>
          {Constants.TAG.map((tag, index) => (
            <TagComponent
              key={index}
              content={tag}
              onPress={() => handleTagSelect(tag)}
              style={selectedTag.includes(tag) && {opacity: 0.5}}
              disabled={selectedTag.includes(tag)}
            />
          ))}
        </RowComponent>
        <ButtonComponent
          title="Lưu"
          style={styles.buttonSave}
          onPress={() => {
            setTag(selectedTag);
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: AppColors.secondary,
  },
  uncheck: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: AppColors.grey,
  },
  rowTag: {
    flexWrap: 'wrap',
    marginTop: 10,
  },
  line: {
    backgroundColor: AppColors.primary,
    opacity: 0.2,
    height: 1,
    marginBottom: 10,
  },
  buttonSave: {
    width: '100%',
    backgroundColor: AppColors.secondary,
  },
});

export default ChooseTagScreen;
