import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { signIn } from '../../../redux/slices/user';

const SignupForm = () => {
  const [newUserName, setNewUserName] = React.useState<string>('');
  const [newEmailAddress, setNewEmailAddress] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [newConfirmPassword, setNewConfirmPassword] = React.useState<string>('');

  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = () => {
    dispatch(signIn({
      UserName: newUserName,
      Password: newPassword,
      Email: newEmailAddress
    }));
  };

  return (
    <View>
      <TextInput 
        label="Username" 
        value={newUserName} 
        onChangeText={setNewUserName} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <TextInput 
        label="Email Address" 
        value={newEmailAddress} 
        onChangeText={setNewEmailAddress} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <TextInput 
        label="Password" 
        value={newPassword} 
        onChangeText={setNewPassword} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <TextInput 
        label="Confirm Password" 
        value={newConfirmPassword} 
        onChangeText={setNewConfirmPassword} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
      />
      <Button 
        style={styles.loginButton} 
        textColor="white" 
        onPress={handleSignup} 
        mode="contained-tonal"
      >Signup!</Button>
      
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

export default SignupForm;