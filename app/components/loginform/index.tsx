import React from 'react';
import { StyleSheet, View } from 'react-native';
import FormTab from './form-tab';
import LoginFormInput from './login-form';
import SignupForm from './signup-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { setErrorMessage } from '../../../redux/slices/user';

export type FormType = 'Login' | 'Signup'

const LoginForm = () => {
  const [currentForm, setCurrentForm] = React.useState<FormType>('Login');
  const dispatch = useDispatch<AppDispatch>();

  const forms: FormType[] = ['Login', 'Signup'];

  const toggleForm = (newForm: FormType) => setCurrentForm(newForm);

  React.useEffect(() => {
    dispatch(setErrorMessage(''));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentForm]);

  return (
    <View>
      <View style={styles.tabContainer}>
        {forms.map((form: FormType, index: number) => (
          <FormTab 
            key={form} 
            currentForm={currentForm} 
            form={form} 
            index={index} 
            toggleForm={toggleForm}
          />
        ))}
      </View>
      {currentForm === 'Login' && <LoginFormInput />}
      {currentForm === 'Signup' && <SignupForm />}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  }
});

export default LoginForm;