import React from 'react';
import {
  SafeAreaView,
  View,
} from 'react-native';
import ChatBox from './components/chatbox';
import Header from './components/header';
import ChatHistory from './components/chat-history';
import { connect } from './api-connections/chat';

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
    <View>
      <Header />
      <SafeAreaView>
        <ChatHistory chatHistory={chatHistory}/>
        <ChatBox />
      </SafeAreaView>
    </View>
  );
}

export default App;
