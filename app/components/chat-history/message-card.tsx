import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PropsType {
    messageData: any
}

const MessageCard = ({messageData}: PropsType) => {
  console.log('Message Card Data: ', messageData);

  return (
    <View style={styles.container}>
      {messageData.type === 2 ? (
        <View style={styles.type2}>
          <Text>{messageData.text}</Text>
        </View>
      ) : (
        <View style={styles.type1}>
          <Text style={styles.userName}>{messageData.userID}</Text>
          <Text style={styles.type2Text}>{messageData.text}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  type2: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  type2Text: {
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  userName: {
    color: 'grey',
  },
  type1: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgreen',
    maxWidth: '80%',
    flexWrap: 'wrap',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default MessageCard;
