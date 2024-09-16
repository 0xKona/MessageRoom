import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PropsType {
    messageData: any
}

const MessageCard = ({messageData}: PropsType) => {
  console.log('MessageDATA: ', messageData);
  return (
    <View style={styles.container}>
      {messageData.type === 2 ? (
        <View style={styles.type2}>
          <Text>{messageData.body}</Text>
        </View>
      ) : (
        <View style={styles.type1}>
          <Text style={styles.type2Text}>{messageData.body}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'orange',
  },
  type2: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  type2Text: {
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  type1: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgreen',
    // width: '45%',
    maxWidth: '80%',
    flexWrap: 'wrap',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default MessageCard;
