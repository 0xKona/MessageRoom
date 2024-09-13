import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import ChatBox from './components/chatbox';
import Header from './components/header';

function App(): React.JSX.Element {

  return (
    <View>
      <Header />
      <SafeAreaView>
        <Text>Test App</Text>
        <ChatBox />
      </SafeAreaView>
    </View>
  );
}

export default App;
