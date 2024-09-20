import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectionSuccess,
  connectionFailed,
  disconnect,
  receiveMessage,
} from '../../redux/slices/websocket';
import { AppDispatch, RootState } from '../../redux/store';
import { parseEnterExit, parseTextMessage } from '../../app/utils/parse';
import { MessageObject } from '../../types/message';
import * as config from '../config/config.json';

interface WebSocketContextValue {
  sendMessage: (msg: string, type?: number) => void;
  closeConnection: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  sendMessage: () => {},
  closeConnection: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userID, userName, loggedIn } = useSelector((state: RootState) => state.user);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const loggedInRef = useRef(loggedIn);
  const maxReconnectAttempts = 5;

  // Keep loggedInRef.current updated
  useEffect(() => {
    loggedInRef.current = loggedIn;
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) {
      // Close the connection if the user is not logged in
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    if (!userID || !userName) {
      console.error('User ID or User Name is missing. Cannot connect WebSocket.');
      return;
    }

    if (socketRef.current) {
      console.log('Websocket already connected!');
      return;
    }

    let socket: WebSocket | null = null;

    const connect = () => {
      const wsUrl = `ws://${config.serverUrl}/ws?userID=${encodeURIComponent(userID)}&userName=${encodeURIComponent(userName)}`;
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket Connected');
        dispatch(connectionSuccess());
        reconnectAttemptsRef.current = 0;
      };

      socket.onmessage = (msg) => {
        console.log('WebSocket Message Received: ', msg.data);
        // @ts-ignore
        const newMessage = processIncomingMessage(msg);
        if (newMessage) {
          dispatch(receiveMessage(newMessage));
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket Closed: ', event);
        dispatch(disconnect());
        socketRef.current = null;

        // Use loggedInRef.current to get the latest loggedIn value (without it, it gets confused even tho it's logs the coreect state?)
        if (Number(event.code) !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && loggedInRef.current) {
          const timeout = Math.min(10000, Math.pow(2, reconnectAttemptsRef.current) * 1000);
          console.log(`Attempting to reconnect in ${timeout / 1000} seconds...`);
          reconnectAttemptsRef.current += 1;
          setTimeout(connect, timeout);
        } else {
          console.log('User not logged in or Max reconnect attempts reached. Giving up.');
          dispatch(connectionFailed('Unable to reconnect to WebSocket.'));
        }
      };

      socket.onerror = (error) => {
        console.log('WebSocket Error: ', error);
        dispatch(connectionFailed('WebSocket encountered an error.'));
        socketRef.current = null;
      };
    };

    connect();

    return () => {
      // closes connection if component is unmounted
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userID, userName, loggedIn, dispatch]);

  const sendMessage = (msg: string, type: number = 1) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageObj: MessageObject = { userID, userName, text: msg, type };
      console.log('Sending Message: ', messageObj);
      socketRef.current.send(JSON.stringify(messageObj));
    } else {
      console.log('WebSocket is not connected or ready.');
    }
  };

  const closeConnection = () => {
    if (socketRef.current) {
      console.log('Closing WebSocket connection.');
      socketRef.current.close(1000, 'Client closed connection');
      socketRef.current = null;
      reconnectAttemptsRef.current = 0;
      dispatch(disconnect());
    } else {
      console.log('No WebSocket connection to close.');
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, closeConnection }}>
      {children}
    </WebSocketContext.Provider>
  );
};

const processIncomingMessage = (messageData: MessageEvent): MessageObject | null => {
  try {
    const parsedMessage = JSON.parse(messageData.data);
    const messageType = parsedMessage.type;
    console.log('New Message Type: ', messageType);

    if (messageType === 1) {
      return parseTextMessage(parsedMessage);
    } else if (messageType === 2) {
      return parseEnterExit(parsedMessage);
    }
    return null;
  } catch (error) {
    console.log('Error processing message: ', error);
    return null;
  }
};
