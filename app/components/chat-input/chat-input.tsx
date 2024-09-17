import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { sendMsg } from '../../api-connections/chat';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatInput = () => {
  const [text, setText] = React.useState('');

  const updateText = (e: any) =>
    setText(e.nativeEvent.text);

  const sendMessage = () => {
    sendMsg(text);
    setText('');
  };

  return (
    <View
      style={styles.ChatInput}
    >
      <SafeAreaView style={styles.SafeContainer}>
        <TextInput style={styles.Input} onChange={updateText} value={text} />
        <TouchableOpacity style={styles.IconContainer} onPress={sendMessage}>
          <Icon name="send" size={30}/>
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
