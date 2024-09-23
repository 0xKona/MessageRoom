import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setErrorMessage, setUserName, userLogin } from '../../redux/slices/user';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper';
import { WebsocketChatNavigationProp } from '../../types/navigation-types';
import * as config from '../config/config.json';

const LoginScreen = () => {
  const { userName, loggedIn, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation<WebsocketChatNavigationProp>();
  const setNewUserName = (newName: string) => {
    if (newName !== ('')) {
      dispatch(setUserName(newName));
      dispatch(setErrorMessage(null));
    } else {
      dispatch(setUserName(newName));
      dispatch(setErrorMessage('Invalid Username!'));
    }
  };
  const handleEnter = () => {
    if (!error) {
      dispatch(userLogin());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Websocket Chat' }],
      });
    }
  };

  const testAPI = async() => {
    try {
      const response = await fetch(`http://${config.serverUrl}:${config.httpPort}/`);
      if (!response.ok) {
        console.error('test api failed: ', response.status);
      } else {
        const json = await response.json();
        console.warn('Test API Success: ', json.message);
      }
    } catch (error) {
      console.error('try catch test api fail: ', error);
    }
  };

  React.useEffect(() => {
    testAPI();
    if (loggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Websocket Chat' }],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Login!</Text>
        <View>
          <TextInput 
            label="Set your Username" 
            value={userName} 
            onChangeText={setNewUserName} 
            mode="outlined" 
            outlineColor="blue" 
            style={{marginHorizontal: 20}}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
        <Button style={styles.loginButton} textColor="white" onPress={handleEnter} mode="contained-tonal">Login to chat!</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%',
    justifyContent: 'space-evenly',
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 200,
    justifyContent: 'space-around',
    // alignItems: 'center',
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  errorText: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
  },
  loginButton: {
    marginHorizontal: 40,
    backgroundColor: 'blue',
  },

});

export default LoginScreen;
