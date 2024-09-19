import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import ChatHistory from '../components/chat-history';
import ChatInput from '../components/chat-input/chat-input';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AppScreen = () => {
  const { messages } = useSelector((state: RootState) => state.websocket);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
      <ChatHistory chatHistory={messages} />
      <ChatInput />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default AppScreen;
