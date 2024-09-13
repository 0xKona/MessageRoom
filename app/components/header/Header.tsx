import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Header = () => (
  <View style={styles.container}>
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.text}>Test Websocket Chat</Text>
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#15223b',
    width: '100%',
    margin: 0,
    padding: 10,
  },
  safeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 0,
    padding: 0,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;
