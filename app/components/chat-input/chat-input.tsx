import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWebSocket } from '../../context/websocketContext';

const ChatInput = () => {
  const [text, setText] = React.useState('');
  const { sendMessage } = useWebSocket();

  const updateText = (e: any) => setText(e.nativeEvent.text);

  const handleSendMessage = () => {
    sendMessage(text, 1);
    setText('');
  };

  return (
    <View style={styles.ChatInput}>
      <SafeAreaView style={styles.SafeContainer}>
        <TextInput placeholder="Enter your message..." style={styles.Input} onChange={updateText} value={text} />
        <TouchableOpacity style={styles.IconContainer} onPress={handleSendMessage}>
          <Icon name="send" size={30} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  ChatInput: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    padding: 10,
  },
  SafeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  IconContainer: {
    paddingRight: 10,
  },
  Input: {
    padding: 10,
    paddingHorizontal: 20,
    margin: 0,
    fontSize: 16,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 20,
    flexGrow: 1,
    color: 'black',
  },
});

export default ChatInput;
