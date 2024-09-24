import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { signIn } from '../../../redux/slices/user';

const LoginFormInput = () => {
  const [loginEmail, setLoginEmail] = React.useState<string>('');
  const [loginPassword, setLoginPassword] = React.useState<string>('');

  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(signIn({
      Email: loginEmail,
      Password: loginPassword,
    }));
  };

  return (
    <View>
      <TextInput 
        label="Email" 
        value={loginEmail} 
        onChangeText={setLoginEmail} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <TextInput 
        label="Password" 
        value={loginPassword} 
        onChangeText={setLoginPassword} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <Button 
        style={styles.loginButton} 
        textColor="white" 
        onPress={handleLogin} 
        mode="contained-tonal"
      >Login to chat!</Button>
      {/* <Text style={styles.errorText}>{error}</Text> */}
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
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    marginHorizontal: 20,
    marginTop: 20
  }
  
});

export default LoginFormInput;