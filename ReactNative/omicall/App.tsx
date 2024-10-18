import React from 'react';
import AppRoutes from './src/presentation/navigators/AppRoutes';
import {Provider} from 'react-redux';
import store from './src/presentation/redux/store.ts';
import {LogBox} from 'react-native';

const App = () => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
