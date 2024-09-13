import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TempMessageType {
    data: string
}

interface PropsType {
    chatHistory: TempMessageType[]
}

const ChatHistory = ({ chatHistory }: PropsType) => {
  const messages = chatHistory.map((msg: TempMessageType, index: number) => (
    <Text key={index}>{msg.data}</Text>
  ));

  return (
    <View style={styles.container}>
      <Text>Chat History</Text>
      {messages}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    margin: 0,
    padding: 20,
  },
});

export default ChatHistory;
