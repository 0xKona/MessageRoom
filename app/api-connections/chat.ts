import { store } from '../../redux/store';
import { MessageObject } from '../../types/message';
const { userID } = store.getState().user;
console.log('Websocket UserID: ', userID);
const socket = new WebSocket(`ws://127.0.0.1:8080/ws?userID=${userID}`);

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
  };

  socket.onerror = (error: WebSocketErrorEvent) => {
    console.log('Socket Error: ', error);
  };
};

let sendMsg = (msg: string) => {
  const messageObj: MessageObject = {userID, text: msg, type: 1};
  console.log('Sending Message: ', messageObj);
  try {
    socket.send(JSON.stringify(messageObj));
  } catch (e) {
    console.log('Error Sending message');
  }
};

export { connect, sendMsg };
