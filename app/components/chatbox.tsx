import React from 'react';
import { connect, sendMsg } from '../api-connections/chat';
import { Button, View } from 'react-native';

const ChatBox = () => {

  const handleSend = () => {
    console.log('Hello Websocket');
    sendMsg('Hello Websocket');
  };

  return (
    <View>
      <Button title="Send" onPress={handleSend}/>
    </View>
  );
};

export default ChatBox;
