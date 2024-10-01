import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';

interface VideoModalProps {
  videoUrl: string;
  isVisible: boolean;
  onClose: () => void;
}

const VideoModal = (props: VideoModalProps) => {
  const {videoUrl, isVisible, onClose} = props;
  return (
    <Modal animationType="slide" visible={isVisible} transparent={true}>
      <View style={styles.videoModalContainer}>
        <Video
          source={{uri: videoUrl}}
          style={styles.fullScreenVideo}
          controls={true}
          resizeMode="contain"
          onFullscreenPlayerWillDismiss={onClose}
          pictureInPicture={true}
          preventsDisplaySleepDuringVideoPlayback={true}
          fullscreenOrientation="all"
          fullscreen={true}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  videoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
});

export default VideoModal;
