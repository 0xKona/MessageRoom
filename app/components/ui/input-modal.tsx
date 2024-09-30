// InputModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type InputModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (inputText: string) => void;
  title?: string;
  message?: string;
  placeholder?: string;
  cancelButtonText?: string;
  submitButtonText?: string;
  secureTextEntry?: boolean;
};

const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  message,
  placeholder,
  cancelButtonText = 'Cancel',
  submitButtonText = 'Submit',
  secureTextEntry = false,
}) => {
  const [inputText, setInputText] = useState<string>('');

  const handleCancel = () => {
    setInputText('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(inputText);
    setInputText('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
          {message ? <Text style={styles.modalMessage}>{message}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder={placeholder || ''}
            secureTextEntry={secureTextEntry}
            value={inputText}
            onChangeText={setInputText}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>{cancelButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{submitButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InputModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#007bff', // Bootstrap's primary color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});