import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { signIn } from '../../../redux/slices/user';

const LoginFormInput = () => {
  const [loginEmail, setLoginEmail] = React.useState<string>('');
  const [loginPassword, setLoginPassword] = React.useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    dispatch(signIn({
      Email: loginEmail,
      Password: loginPassword,
    }));
  };

  return (
    <>
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
      <Text style={styles.errorText}>{error}</Text>
      <Button 
        loading={loading}
        style={styles.loginButton} 
        textColor="white" 
        onPress={handleLogin} 
        mode="contained-tonal"
      >Login to chat!</Button>
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
    textAlign: 'center'
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