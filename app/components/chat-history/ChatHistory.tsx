import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MessageCard from './message-card';
import { MessageObject } from '../../../types/message';

interface PropsType {
    chatHistory: MessageObject[]
}

const ChatHistory = ({ chatHistory }: PropsType) => {
  // console.log('CHAT HISTORY: ', chatHistory);
  return (
    <FlatList
      inverted
      style={styles.container}
      data={[...chatHistory].reverse()}
      renderItem={({item, index}) => <MessageCard key={index} messageData={item} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    marginBottom: 0,
    paddingHorizontal: 20,
    width: '100%',
    flexGrow: 1,
    maxHeight: '90%',
    alignSelf: 'flex-end',
  },
});

export default ChatHistory;
