import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount, userLogout } from '../../redux/slices/user';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationProp } from '../../types/navigation-types';
import { AppDispatch, RootState } from '../../redux/store';
import { useWebSocket } from '../context/websocketContext';
import { Button } from 'react-native-paper';

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { closeConnection } = useWebSocket();
  const navigation = useNavigation<LoginNavigationProp>();
  const {userName, userID} = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(userLogout());
    navigation.reset({index: 0, routes: [{ name: 'Login'}]});
    closeConnection();
  };

  const handleDelete = () => {
    dispatch(deleteAccount({Password: '123456', onSuccess: handleLogout}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.textLabel}>Logged in as:</Text>
        <Text style={styles.textMain}>{userName}</Text>
        <Text style={styles.textLabel}>UserID:</Text>
        <Text style={styles.textUserID}>{`(${userID})`}</Text>
      </View>
      <Button style={styles.logoutButton} textColor="white" onPress={handleLogout} mode="contained-tonal">Logout</Button>
      <Button style={styles.logoutButton} textColor='white' onPress={handleDelete} mode='contained-tonal'>Test Delete</Button>
    </View>
  );
};

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
    color: 'white',
  },
});

export default SettingsScreen;
