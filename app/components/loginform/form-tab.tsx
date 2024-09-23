import React from 'react';
import { FormType } from '.';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PropsInterface {
    currentForm: FormType;
    form: FormType;
    index: number;
    toggleForm: (newForm: FormType) => void
}

const FormTab = ({currentForm, form, index, toggleForm}: PropsInterface) => {

  return (
    <TouchableOpacity style={styles(currentForm, form, index).container} onPress={() => toggleForm(form)}>
      <Text style={styles(currentForm, form).text}>{form}</Text>
    </TouchableOpacity>
  );
};

const styles = (currentForm?: FormType, form?: FormType, index?: number) => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: currentForm === form ? 'blue' : 'lightgrey',
    borderTopLeftRadius: index === 0 ? 5 : 0,
    borderTopRightRadius: index === 1 ? 5 : 0
  },
  text: {
    color: currentForm === form ? 'white' : 'black'
  }
});

export default FormTab;