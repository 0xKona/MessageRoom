import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// RootStackParamList should list all the routes in your app
export type RootStackParamList = {
    'Websocket Chat': undefined; // or any params if applicable
    'Login': undefined; // or any params if applicable
    // other routes...
  };

export type WebsocketChatNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Websocket Chat'
>;
