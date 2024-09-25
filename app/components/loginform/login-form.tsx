import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { signIn } from '../../../redux/slices/user';
import { emailRegex, passwordRegex } from '../../utils/regex';

interface FormDataKeyType {
    value: string;
    error: string | undefined
}

interface FormDataStateType {
    emailAddress: FormDataKeyType
    password: FormDataKeyType
}

const LoginFormInput = () => {
  const [formData, setFormData] = React.useState<FormDataStateType>({
    emailAddress: { value: '', error: undefined }, 
    password: { value: '', error: undefined}
  });

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    console.log(`Logging in with \n Email: ${formData.emailAddress.value} 
    \n Password: ${formData.password.value}`);
    dispatch(signIn({
      Email: formData.emailAddress.value,
      Password: formData.password.value,
    }));
  };

  // Validate email
  const emailIsValid = (text: string): string | undefined => {
    return emailRegex.test(text) ? undefined : 'Email is not valid';
  };
  const setNewEmailAddress = (text: string): void => {
    const checkError = emailIsValid(text);
    setFormData((prevState) => ({...prevState, emailAddress: {value: text, error: checkError}}));
  };

  // Set and validate password
  const passwordIsValid = (text: string): string | undefined => {
    return passwordRegex.test(text) ? undefined : 'Password must be six or more characters';
  };
  const setNewPassword = (text: string): void => {
    const checkError = passwordIsValid(text);
    setFormData((prevState) => (
      {
        ...prevState, 
        password: {
          value: text, 
          error: checkError
        }
      }
    ));
  };

  const formErrors: string[] = Object.keys(formData).map((data: string) => {
    if (formData[data as keyof FormDataStateType].error) {
      return formData[data as keyof FormDataStateType].error;
    }}).filter((item: string | undefined) => item !== undefined);

  return (
    <>
      <TextInput 
        label="Email" 
        value={formData.emailAddress.value} 
        onChangeText={setNewEmailAddress} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
        error={formData.emailAddress.error ? true : false}
      />
      <TextInput 
        label="Password" 
        value={formData.password.value} 
        onChangeText={setNewPassword} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
        error={formData.password.error ? true : false}
      />
      <Text style={styles.errorText}>{error || formErrors[0]}</Text>
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