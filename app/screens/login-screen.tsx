import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUserName, userLogin } from '../../redux/slices/user';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { WebsocketChatNavigationProp } from '../../types/navigation-types';

const LoginScreen = () => {
  const { userName } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation<WebsocketChatNavigationProp>();
  const setNewUserName = (newName: string) => dispatch(setUserName(newName));
  console.log('User Name: ', userName);
  const handleEnter = () => {
    dispatch(userLogin());
    navigation.navigate('Websocket Chat');
  };

  return (
    <View style={styles.container}>
      <TextInput label="User Name" value={userName} onChangeText={setNewUserName} mode="outlined"/>


      <Button title="Enter" onPress={handleEnter}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-evenly',
  },
});

export default LoginScreen;
