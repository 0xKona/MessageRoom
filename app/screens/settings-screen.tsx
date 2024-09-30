import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount, userLogout } from '../../redux/slices/user';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationProp } from '../../types/navigation-types';
import { AppDispatch, RootState } from '../../redux/store';
import { useWebSocket } from '../context/websocketContext';
import { Button } from 'react-native-paper';
import InputModal from '../components/ui/input-modal';

const SettingsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { closeConnection } = useWebSocket();
  const navigation = useNavigation<LoginNavigationProp>();
  const { userName, userID } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(userLogout());
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    closeConnection();
  };

  const handleDelete = (password: string) => {
    dispatch(deleteAccount({ Password: password, onSuccess: handleLogout }));
  };

  const handleDeleteClick = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.textLabel}>Logged in as:</Text>
        <Text style={styles.textMain}>{userName}</Text>
        <Text style={styles.textLabel}>UserID:</Text>
        <Text style={styles.textUserID}>{`(${userID})`}</Text>
      </View>
      <Button
        style={styles.logoutButton}
        textColor="white"
        onPress={handleLogout}
        mode="contained-tonal"
      >
        Logout
      </Button>
      <Button
        style={styles.logoutButton}
        textColor="white"
        onPress={handleDeleteClick}
        mode="contained-tonal"
      >
        Delete Account
      </Button>

      {/* InputModal for deleting account */}
      <InputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleDelete}
        title="Delete Account?"
        message="Enter your password to delete your account. This action is irreversible."
        placeholder="Password"
        cancelButtonText="Cancel"
        submitButtonText="Delete"
        secureTextEntry={true}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
  },
  userInfo: {
    backgroundColor: 'white',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
  },
  textLabel: {
    marginBottom: 5,
  },
  textMain: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  textUserID: {
    color: 'grey',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'red',
    alignSelf: 'center',
    marginVertical: 10,
  },
});