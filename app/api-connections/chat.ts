const socket = new WebSocket('ws://localhost:8080/ws');

let connect = (cb: any) => {
  console.log('Attempting Connection...');

  socket.onopen = () => {
    console.log('Successfully Connected');
  };

  socket.onmessage = (msg: WebSocketMessageEvent) => {
    console.log(msg);
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
  console.log('Sending Message: ', msg);
  socket.send(msg);
};

export { connect, sendMsg };
