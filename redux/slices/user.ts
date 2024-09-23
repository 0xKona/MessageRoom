import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import uuid from 'react-native-uuid';
import * as config from '../../app/config/config.json';

interface UserState {
    userID: string,
    userName: string,
    loading: boolean,
    loggedIn: boolean
    error: string | null
}

const initialState: UserState = {
  userID: '',
  userName: '',
  loggedIn: false,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'user/signIn', 
  async (params: {UserName: string, Email: string, Password: string}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://${config.serverUrl}:${config.httpPort}/users/signup`, {
        UserName: params.UserName,
        Password: params.Password,
        Email: params.Email

      });

      if (response.status === 200) {
        console.log('Sign up successful, make a green notification for this');
      }
    } catch (error: any) {
      console.log('[SIGN IN ERROR]: ', error);
      rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID(state, action: PayloadAction<string>) {
      state.userID = action.payload; 
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    userLogout : () => initialState,
    userLogin(state) {
      state.loading = true;
      state.loggedIn = true;
      state.userID = String(uuid.v4());
      state.loading = false;
    },
  },
});

export const { userLogin, userLogout, setUserID, setUserName, setLoading, setErrorMessage } =
  userSlice.actions;
export default userSlice.reducer;
