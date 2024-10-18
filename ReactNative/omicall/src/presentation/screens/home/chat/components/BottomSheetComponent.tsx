import React, {RefObject} from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Alert, StyleSheet, StatusBar, Platform, Linking} from 'react-native';
import ItemComponent from './ItemComponent.tsx';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {Constants} from '../../../../../core/constants/Constants.ts';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

interface BottomSheetComponentProps {
  bottomSheetRef: RefObject<BottomSheet>;
  setMediaPicked: (media: ImageOrVideo | undefined) => void;
  setFilePicked: (file: DocumentPickerResponse | undefined) => void;
}

const BottomSheetComponent = (props: BottomSheetComponentProps) => {
  const {bottomSheetRef, setMediaPicked, setFilePicked} = props;

  const backdrop = (backdropProps: any) => (
    <BottomSheetBackdrop
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  const handleMediaPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    })
      .then(image => {
        setMediaPicked(image);
        bottomSheetRef?.current?.close();
      })
      .catch(err => {
        if (err.code === 'E_NO_LIBRARY_PERMISSION') {
          Alert.alert(
            'Thông báo',
            'Vui lòng cấp quyền truy cập ảnh để sử dụng tính năng này',
            [
              {
                text: 'Hủy',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Cài đặt',
                onPress: () => {
                  Linking.openSettings().then(
                    () => {},
                    err => console.error('An error occurred', err),
                  );
                },
              },
            ],
          );
        }
      });
  };

  const handleOpenCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'any',
    })
      .then(image => {
        setMediaPicked(image);
        bottomSheetRef?.current?.close();
      })
      .catch(err => {
        if (err.code === 'E_NO_CAMERA_PERMISSION') {
          Alert.alert(
            'Thông báo',
            'Vui lòng cấp quyền truy cập camera để sử dụng tính năng này',
            [
              {
                text: 'Hủy',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Cài đặt',
                onPress: () => {
                  Linking.openSettings().then(
                    () => {},
                    err => console.error('An error occurred', err),
                  );
                },
              },
            ],
          );
        }
      });
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      if (result && result.size) {
        const fileSizeInMB = result.size / (1024 * 1024);

        if (fileSizeInMB > Constants.LIMIT_DOCUMENT_SIZE) {
          Alert.alert(
            'Lỗi',
            `Tập tin không được vượt quá ${Constants.LIMIT_DOCUMENT_SIZE} MB!`,
          );
        } else {
          setFilePicked(result);
          bottomSheetRef?.current?.close();
        }
      } else {
        console.log('Invalid file:', result);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('File selection canceled');
      } else {
        throw err;
      }
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index >= 0) {
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.5)');
      StatusBar.setBarStyle('light-content');
    } else {
      Platform.OS === 'android' && StatusBar.setBackgroundColor('white');
      StatusBar.setBarStyle('dark-content');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <BottomSheet
        snapPoints={['30%']}
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={backdrop}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <ItemComponent
            icon={'image'}
            title={'Phương tiện'}
            description={'Chia sẻ ảnh hoặc video'}
            onPress={handleMediaPicker}
          />
          <ItemComponent
            icon={'camera'}
            title={'Camera'}
            description={'Chụp ảnh mới'}
            onPress={handleOpenCamera}
          />
          <ItemComponent
            icon={'attach'}
            title={'File'}
            description={'Chia sẻ tập tin'}
            onPress={handleDocumentPicker}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 15,
  },
});

export default BottomSheetComponent;
