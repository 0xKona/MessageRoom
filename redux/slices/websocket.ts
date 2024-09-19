// websocketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageObject } from '../../types/message';

interface WebSocketState {
  socketConnected: boolean;
  messages: MessageObject[];
  error: string | null;
}

const initialState: WebSocketState = {
  socketConnected: false,
  messages: [],
  error: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectionSuccess(state) {
      state.socketConnected = true;
      state.error = null;
    },
    connectionFailed(state, action: PayloadAction<string>) {
      state.socketConnected = false;
      state.error = action.payload;
    },
    disconnect(state) {
      state.socketConnected = false;
    },
    receiveMessage(state, action: PayloadAction<MessageObject>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  connectionSuccess,
  connectionFailed,
  disconnect,
  receiveMessage,
  clearMessages,
} = websocketSlice.actions;

export default websocketSlice.reducer;
