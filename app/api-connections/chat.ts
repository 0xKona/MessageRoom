import { userLogout } from '../../redux/slices/user';
import { store } from '../../redux/store';
import { MessageObject } from '../../types/message';

const { userID, userName } = store.getState().user;

let socket = new WebSocket(`ws://127.0.0.1:8080/ws?userID=${userID}&userName=${userName}`);

let connect = (cb: any) => {
  console.log('Attempting Connection...');

  socket.onopen = () => {
    console.log('Successfully Connected');
  };

  socket.onmessage = (msg: WebSocketMessageEvent) => {
    cb(msg);
  };

  socket.onclose = (event: WebSocketCloseEvent) => {
    console.log('Socket Closed Connection: ', event);
    store.dispatch(userLogout());
    closeChatConnection();
  };

  socket.onerror = (error: WebSocketErrorEvent) => {
    console.log('Socket Error: ', error);
  };
};

let sendMsg = (msg: string, type: number = 1) => {
  const messageObj: MessageObject = {userID, userName, text: msg, type};
  console.log('Sending Message: ', messageObj);
  try {
    socket.send(JSON.stringify(messageObj));
  } catch (e) {
    console.log('Error Sending message');
  }
};

let closeChatConnection = () => {
  socket.close();
};

export { connect, sendMsg, closeChatConnection };

// TODO : MOVE SOCKET TO ME MANAGED BY REDUX (MAYBE ... LOOK IT UP)
