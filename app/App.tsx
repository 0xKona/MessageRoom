import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Header from './components/header';
import ChatHistory from './components/chat-history';
import { connect } from './api-connections/chat';
import ChatInput from './components/chat-input/chat-input';
import { MessageObject } from '../types/message';
import { parseEnterExit, parseTextMessage } from './utils/parse';

const App = (): React.JSX.Element => {

  const [chatHistory, setChatHistory] = React.useState<MessageObject[]>([]);

  React.useEffect(() => {
    connect((messageData: MessageEvent) => {
      try {
        let messageType = JSON.parse(messageData.data).type;
        console.log('New Message Type: ', messageType);
        let newMessage: MessageObject | null = null;
        if (messageType === 1) {
          newMessage = parseTextMessage(messageData);
        } else if (messageType === 2) {
          newMessage = parseEnterExit(messageData);
        }
        if (newMessage !== null) {
          const newChatHistory = [...chatHistory, newMessage];
          setChatHistory(newChatHistory);
        }
      } catch (error) {
        console.log(error);
      }
    });
    console.log(chatHistory);
  }, [chatHistory]);

  return (
    <View style={styles.container}>
      <Header />
      <ChatHistory chatHistory={chatHistory}/>
      <ChatInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default App;
