import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID(state, action: PayloadAction<string>) {
      state.userID = action.payload; // Directly set userID
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
    resetUserState : () => initialState,
    userLogin(state) {
      state.loading = true;
      state.loggedIn = true;
      state.userID = String(uuid.v4());
      state.loading = false;
    },
  },
});

export const { userLogin, setUserID, setUserName, setLoading, setErrorMessage } =
  userSlice.actions;
export default userSlice.reducer;
