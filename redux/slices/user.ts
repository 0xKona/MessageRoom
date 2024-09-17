import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userID: number | null,
    userName: string | null,
    loading: boolean | null,
    error: string | null
}

const initialState: UserState = {
  userID: null,
  userName: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID(state, action: PayloadAction<number | null>) {
      state.userID = action.payload; // Directly set userID
    },
    setUserName(state, action: PayloadAction<string | null>) {
      state.userName = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export default userSlice.reducer;
