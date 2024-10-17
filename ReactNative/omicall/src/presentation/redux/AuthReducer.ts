import {createSlice} from '@reduxjs/toolkit';
import {LoginModel} from '../../models/LoginModel.ts';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: {} as LoginModel,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },

    removeAuth: state => {
      state.authData = {} as LoginModel;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;
