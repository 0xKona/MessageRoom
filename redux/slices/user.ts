import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../../app/config/config.json';

interface UserData {
  email: string,
  refreshToken: string,
  token: string,
  createdAt: string,
  updatedAt: string
}
interface UserState {
    userID: string,
    userName: string,
    userData: UserData,
    loading: boolean,
    loggedIn: boolean
    error: string | null
}

const initialState: UserState = {
  userID: '',
  userName: '',
  userData: {
    email: '',
    refreshToken: '',
    token: '',
    createdAt: '',
    updatedAt: ''
  },
  loggedIn: false,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  'user/signUp', 
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
      console.log('[SIGN UP ERROR]: ', error);
      rejectWithValue(error.message);
    }
  }
);

export interface LoginResponseType {
  CreatedAt: string;
  Email: string;
  ID: string;
  Password: string;
  RefreshToken: string;
  Token: string;
  UpdatedAt: string;
  UserID: string;
  UserName: string;
}

export const signIn = createAsyncThunk(
  'user/signIn',
  async (params: {Email: string, Password: string}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://${config.serverUrl}:${config.httpPort}/users/login`, {
        Password: params.Password,
        Email: params.Email

      });

      if (response.status === 200) {
        console.log('Sign up successful, make a green notification for this');
        console.log('Sign in response: ', response.data);
        return response.data;
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
  },
  extraReducers: builder => {
    builder.addCase(signIn.rejected, (state, action) => {
      console.log('login failed', action.error);
      state.loading = false;
      state.error = action.error.message || 'Failed to login';
    }),
    builder.addCase(signIn.pending, (state) => {
      console.log('login pending');
      state.loading = true;
    }),
    builder.addCase(signIn.fulfilled, (state, action) => {
      console.log('login fuffilled, action.payload = ', action.payload);
      state.loading = false;
      state.loggedIn = true;
      state.userID = action.payload.UserID;
      state.userName = action.payload.UserName;
      state.userData = {
        email: action.payload.Email,
        refreshToken: action.payload.RefreshToken,
        token: action.payload.Token,
        createdAt: action.payload.CreatedAt,
        updatedAt: action.payload.UpdatedAt
      };
    });
  }
});

export const { userLogout, setUserID, setUserName, setLoading, setErrorMessage } =
  userSlice.actions;
export default userSlice.reducer;
