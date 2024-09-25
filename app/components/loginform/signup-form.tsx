import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { signUp } from '../../../redux/slices/user';
import { FormType } from '.';
import { emailRegex, passwordRegex, usernameRegex } from '../../utils/regex';

interface PropsType {
    toggleForm: (newForm: FormType) => void
}

interface FormDataKeyType {
    value: string;
    error: string | undefined
}
interface FormDataStateType {
    userName: FormDataKeyType
    emailAddress: FormDataKeyType
    password: FormDataKeyType
    confirmPassword: FormDataKeyType
}

const SignupForm = ({ toggleForm }: PropsType) => {

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = React.useState<FormDataStateType>({
    userName: {value: '', error: undefined},
    emailAddress: {value: '', error: undefined},
    password: {value: '', error: undefined},
    confirmPassword: {value: '', error: undefined}
  });
  
  // Set and validate username
  const userNameIsValid = (text: string): string | undefined => {
    return usernameRegex.test(text) ? undefined : 'Username must be between 3 and 30 characters and cannot contain special characters';
  };
  const setNewUserName = (text: string): void => {
    const checkError = userNameIsValid(text);
    setFormData((prevState) => ({...prevState, userName: {value: text, error: checkError}}));
  };

  // Set and validate email
  const emailIsValid = (text: string): string | undefined => {
    return emailRegex.test(text) ? undefined : 'Email is not valid';
  };
  const setNewEmailAddress = (text: string): void => {
    const checkError = emailIsValid(text);
    setFormData((prevState) => ({...prevState, emailAddress: {value: text, error: checkError}}));
  };
  
  // Set and Match confirmPassword
  const passwordsMatch = (text: string): string | undefined => {
    return text === formData.password.value ? undefined : 'Passwords must match';
  };
  const setNewConfirmPassword = (text: string): void => {
    const checkError = passwordsMatch(text);
    setFormData((prevState) => ({...prevState, confirmPassword: {value: text, error: checkError}}));
  };

  // Set and validate password
  const passwordIsValid = (text: string): string | undefined => {
    return passwordRegex.test(text) ? undefined : 'Password must be six or more characters';
  };
  const setNewPassword = (text: string): void => {
    const checkError = passwordIsValid(text);
    const isMatching = passwordsMatch(text);
    setFormData((prevState) => (
      {
        ...prevState, 
        password: {
          value: text, 
          error: checkError
        }, 
        confirmPassword: {
          value: prevState.confirmPassword.value,
          error: isMatching
        }
      }
    ));
  };

  const validateForSubmission = () => {
    const userValidate = userNameIsValid(formData.userName.value);
    const emailValidate = emailIsValid(formData.emailAddress.value);
    const passwordValidate = passwordIsValid(formData.password.value);
    return !userValidate && !emailValidate && !passwordValidate;
  };

  const handleSignup = () => {
    if (validateForSubmission()) {
      dispatch(signUp({
        UserName: formData.userName.value,
        Password: formData.password.value,
        Email: formData.emailAddress.value,
        onSuccess: () => toggleForm('Login')
      }));
    }
  };

  const formErrors: string[] = Object.keys(formData).map((data: string) => {
    if (formData[data as keyof FormDataStateType].error) {
      return formData[data as keyof FormDataStateType].error;
    }}).filter((item: string | undefined) => item !== undefined);

  return (
    <View style={styles.container}>
      <TextInput 
        label="Enter Username*" 
        value={formData.userName.value} 
        onChangeText={setNewUserName} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
        error={formData.userName.error ? true : false}
      />
      <TextInput 
        label="Enter Email Address*" 
        value={formData.emailAddress.value} 
        onChangeText={setNewEmailAddress} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
        error={formData.emailAddress.error ? true : false}
      />
      <TextInput 
        label=" Enter Password*" 
        value={formData.password.value} 
        onChangeText={setNewPassword} 
        mode="outlined" 
        outlineColor="blue" 
        style={styles.textInput}
        error={formData.password.error ? true : false}
        secureTextEntry
      />
      <TextInput 
        label="Confirm Password*" 
        value={formData.confirmPassword.value} 
        onChangeText={setNewConfirmPassword} 
        mode="outlined" 
        outlineColor="blue" 
        error={formData.confirmPassword.error ? true : false}
        style={styles.textInput}
        secureTextEntry
      />
      <Text style={styles.errorText}>{error || formErrors[0]}</Text>
      <Button 
        loading={loading}
        style={styles.loginButton} 
        textColor="white" 
        onPress={handleSignup} 
        mode="contained-tonal"
      >Signup!</Button>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
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

export default SignupForm;