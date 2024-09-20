import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// RootStackParamList should list all the routes in your app
export type RootStackParamList = {
    'Websocket Chat': undefined; // or any params if applicable
    'Login': undefined; // or any params if applicable
    'Settings': undefined
    // other routes...
  };

export type WebsocketChatNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Websocket Chat'
>;

export type SettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

export type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;
