import React from 'react';
import AppRoutes from './src/presentation/navigators/AppRoutes';
import {Provider} from 'react-redux';
import store from './src/presentation/redux/store.ts';

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
