import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Styles} from '../../../core/constants/Styles';
import {Constants} from '../../../core/constants/Constants';

const SplashScreen = () => {
  const handleImageError = (error: any) => {
    console.error('Image loading error:', error.nativeEvent.error);
  };

  return (
    <View style={[Styles.center, Styles.container]}>
      <Image
        source={{uri: Constants.logoUrl}}
        onError={handleImageError}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '70%',
    height: '10%',
  },
});
export default SplashScreen;
