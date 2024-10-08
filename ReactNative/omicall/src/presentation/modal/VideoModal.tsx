import {Modal, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video, {VideoRef} from 'react-native-video';
import Slider from '@react-native-community/slider';
import {AppColors} from '../../core/constants/AppColors';
import {Fonts} from '../../core/constants/Fonts.ts';
import {Styles} from '../../core/constants/Styles.ts';

interface VideoModalProps {
  videoUrl: string;
  isVisible: boolean;
  onClose: () => void;
}

const VideoModal = (props: VideoModalProps) => {
  const {videoUrl, isVisible, onClose} = props;
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!videoEnded) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
    resetControlsTimeout();
  };

  const handleReplay = () => {
    setVideoEnded(false);
    setPaused(false);
    videoRef.current?.seek(0);
    resetControlsTimeout();
  };

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
    if (videoEnded) {
      setVideoEnded(false);
      setPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (controlsVisible && !videoEnded) {
      resetControlsTimeout();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controlsVisible, videoEnded]);

  useEffect(() => {
    if (!isVisible) {
      setVideoEnded(false);
      setPaused(false);
    }
  }, [isVisible]);

  return (
    <Modal animationType={'slide'} visible={isVisible} transparent={true}>
      <TouchableOpacity
        style={Styles.flex}
        onPress={toggleControls}
        activeOpacity={1}>
        <View style={styles.modalBackground}>
          {controlsVisible && (
            <>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={1}>
                <Ionicons name="close" size={30} color={AppColors.white} />
              </TouchableOpacity>
              {videoEnded ? (
                <TouchableOpacity
                  onPress={handleReplay}
                  style={styles.pauseButton}
                  activeOpacity={1}>
                  <MaterialIcons
                    name="replay"
                    size={60}
                    color={AppColors.white}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setPaused(!paused)}
                  style={styles.pauseButton}
                  activeOpacity={1}>
                  <Ionicons
                    name={paused ? 'play' : 'pause'}
                    size={60}
                    color={AppColors.white}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          <Video
            ref={videoRef}
            source={{uri: videoUrl}}
            style={styles.video}
            resizeMode="contain"
            ignoreSilentSwitch="ignore"
            paused={paused}
            onEnd={() => {
              setVideoEnded(true);
              setControlsVisible(true);
            }}
            onLoad={data => setDuration(data.duration)}
            onProgress={data => setCurrentTime(data.currentTime)}
          />
        </View>
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        {controlsVisible && (
          <>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              minimumTrackTintColor={AppColors.white}
              maximumTrackTintColor={AppColors.greyIcon}
              thumbTintColor={AppColors.white}
              onSlidingComplete={handleSeek}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: AppColors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    zIndex: 1,
  },
  pauseButton: {
    position: 'absolute',
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  slider: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
  },
  timeContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  timeText: {
    color: AppColors.white,
    fontFamily: Fonts.regular,
  },
});

export default VideoModal;
