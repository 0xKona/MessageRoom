import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { WebsocketChatNavigationProp } from '../../types/navigation-types';
import LoginForm from '../components/loginform';

const LoginScreen = () => {
  const { loggedIn, userData } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<WebsocketChatNavigationProp>();
  console.log('User LoggedIn : ', loggedIn);
  console.log('user Data: ', userData);
  React.useEffect(() => {
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
        <LoginForm />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%',
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop: 60,
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 60
  },
});

export default LoginScreen;
