import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { closeChatConnection } from '../api-connections/chat';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../redux/slices/user';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationProp } from '../../types/navigation-types';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogout = () => {
    closeChatConnection();
    dispatch(userLogout());
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 1,
    // backgroundColor: 'white',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    alignSelf: 'center',
    padding: 20,
    color: 'white',
  },
});

export default SettingsScreen;
