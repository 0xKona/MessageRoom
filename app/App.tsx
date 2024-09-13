import React from 'react';
import {
  SafeAreaView,
  View,
} from 'react-native';
import ChatBox from './components/chatbox';
import Header from './components/header';
import ChatHistory from './components/chat-history';

function App(): React.JSX.Element {

  return (
    <View>
      <Header />
      <SafeAreaView>
        <ChatHistory chatHistory={[]}/>
        <ChatBox />
      </SafeAreaView>
    </View>
  );
}

export default App;
