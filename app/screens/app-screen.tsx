import { StyleSheet, View } from 'react-native';
import ChatHistory from '../components/chat-history';
import ChatInput from '../components/chat-input/chat-input';
import React from 'react';
import { MessageObject } from '../../types/message';
import { connect } from '../api-connections/chat';
import { parseEnterExit, parseTextMessage } from '../utils/parse';


const AppScreen = () => {
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

export default AppScreen;
