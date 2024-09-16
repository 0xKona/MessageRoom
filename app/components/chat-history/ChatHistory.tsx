import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MessageCard from './message-card';

interface TempMessageType {
    data: string
}

interface PropsType {
    chatHistory: TempMessageType[]
}

const ChatHistory = ({ chatHistory }: PropsType) => {
  console.log('ChatHistory', chatHistory);

  const messages = chatHistory.map((msg: TempMessageType, index: number) => {
    const message = JSON.parse(msg.data);
    console.log('Message: ', message.body);
    return (
      <MessageCard key={index} messageData={message} />
    );});

  return (
    <ScrollView style={styles.container}>
      {messages}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    margin: 0,
    padding: 20,
    width: '100%',
    flexGrow: 1,
  },
});

export default ChatHistory;
