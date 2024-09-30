import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { WebsocketChatNavigationProp } from '../../types/navigation-types';
import LoginForm from '../components/loginform';

const LoginScreen = () => {
  const { loggedIn } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<WebsocketChatNavigationProp>();

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
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Login!</Text>
        <LoginForm />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    height: '100%',
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop: 80,
    minHeight: '100%'
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 60
  },
});

export default LoginScreen;
