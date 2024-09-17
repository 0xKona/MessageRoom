import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MessageCard from './message-card';
import { MessageObject } from '../../../types/message';

interface PropsType {
    chatHistory: MessageObject[]
}

const ChatHistory = ({ chatHistory }: PropsType) => {
  console.log('ChatHistory: ', chatHistory);
  const messages = chatHistory.map((msg: MessageObject, index: number) => {
    return (
      <MessageCard key={index} messageData={msg} />
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
