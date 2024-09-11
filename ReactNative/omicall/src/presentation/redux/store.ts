import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './AuthReducer.ts';

const store = configureStore({
  reducer: {
    authReducer: authReducer,
  },
});

export default store;
