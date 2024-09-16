import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Header from './components/header';
import ChatHistory from './components/chat-history';
import { connect } from './api-connections/chat';
import ChatInput from './components/chat-input/chat-input';

function App(): React.JSX.Element {

  const [chatHistory, setChatHistory] = React.useState([]);

  React.useEffect(() => {
    connect((msg: never) => {
      console.log('new message');
      const newChatHistory = [...chatHistory, msg];
      setChatHistory(newChatHistory);
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
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default App;
