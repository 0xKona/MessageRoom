import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface PropsType {
    messageData: any
}

const MessageCard = ({messageData}: PropsType) => {
  console.log('Message Card Data: ', messageData);
  const { userID } = useSelector((state: RootState) => state.user);

  const isMe = userID === messageData.userID;

  return (
    <View style={styles.container}>
      {messageData.type === 2 ? (
        <View style={styles.type2}>
          <Text>{messageData.text}</Text>
        </View>
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{...styles.type1, alignSelf: isMe ? 'flex-end' : 'flex-start'}}>
          <Text style={styles.userName}>{messageData.userName}</Text>
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
