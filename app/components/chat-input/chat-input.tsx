import React from 'react';
import { Button, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { sendMsg } from '../../api-connections/chat';

const ChatInput = () => {
  const [text, setText] = React.useState('');

  const updateText = (e: any) =>
    setText(e.nativeEvent.text);

  const sendMessage = () => {
    sendMsg(text);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.ChatInput}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.SafeContainer}>
        <TextInput style={styles.Input} onChange={updateText} value={text} />
        <Button title="Send" onPress={sendMessage}/>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ChatInput: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#15223b',
    padding: 10,
  },
  SafeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
  },
  Input: {
    padding: 10,
    margin: 0,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    flexGrow: 1,
    color: 'white',
  },
});

export default ChatInput;
