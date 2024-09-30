import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as config from '../../app/config/config.json';
import Snackbar from 'react-native-snackbar';

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
  async (params: {UserName: string, Email: string, Password: string, onSuccess?: () => void}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://${config.serverUrl}:${config.httpPort}/users/signup`, {
        UserName: params.UserName,
        Password: params.Password,
        Email: params.Email
      });

      if (response.status === 200) {
        console.log('Sign up successful');
        Snackbar.show({
          text: 'Account Created: You can now sign in!',
          duration: 10000,
          action: {
            text: 'Dismiss',
            textColor: 'white',
            onPress: () => Snackbar.dismiss()
          }
        });
        params.onSuccess && params.onSuccess();
      }
    } catch (error: any) {
      console.log('[SIGN UP ERROR]: ', error.response);
      return rejectWithValue(error.message);
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
        console.log('Sign in successful, make a green notification for this');
        return response.data;
   
      } else {
        return rejectWithValue(`Login failed: ${response.statusText}`);
      }
    } catch (error: any) {
      console.log('[SIGN IN ERROR]: ', error.response.data.error);
      if (error.response) {
        return rejectWithValue(`Login Failed: \n ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        return rejectWithValue('Network error: No response from the server');
      } else {
        return rejectWithValue(`Login failed: ${error.message}`);
      }
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (params: {Password: string}, { rejectWithValue, getState }) => {
    // @ts-ignore TODO - fix this. 
    const { user } = getState();
    console.log('GET STATE TESTING: ', user.userData.token);
    try {
      const response = await axios.delete(`http://${config.serverUrl}:${config.httpPort}/users/delete`, {
        headers: {
          Authorization: user.userData.token
        },
        data: {
          password: params.Password
        }
      });
      console.log('Delete User Response: ', response);
    } catch (error) {
      
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
    builder.addCase(signIn.pending, (state) => {
      console.log('[LOGIN]: Login pending');
      state.loading = true;
    }),
    builder.addCase(signIn.rejected, (state, action) => {
      console.log('[LOGIN]: Login rejected');
      state.loading = false;
      state.error = String(action.payload || 'Failed to login. \n Please try again later');
    }),
    builder.addCase(signIn.fulfilled, (state, action) => {
      console.log('[LOGIN]: Login successfull');
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
