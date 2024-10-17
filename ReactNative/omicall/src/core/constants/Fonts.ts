import {Platform} from 'react-native';

export const Fonts = {
  black: Platform.OS === 'ios' ? 'Roboto Black' : 'Roboto-Black',
  bold: Platform.OS === 'ios' ? 'Roboto Bold' : 'Roboto-Bold',
  light: Platform.OS === 'ios' ? 'Roboto Light' : 'Roboto-Light',
  medium: Platform.OS === 'ios' ? 'Roboto Medium' : 'Roboto-Medium',
  regular: Platform.OS === 'ios' ? 'Roboto Regular' : 'Roboto-Regular',
  thin: Platform.OS === 'ios' ? 'Roboto Thin' : 'Roboto-Thin',
};
