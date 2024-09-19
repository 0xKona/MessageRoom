import React from 'react';
import AppScreen from './screens/app-screen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login-screen';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { RootStackParamList, SettingsNavigationProp } from '../types/navigation-types';
import { PersistGate } from 'redux-persist/integration/react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import SettingsScreen from './screens/settings-screen';
import { WebSocketProvider } from './context/websocketContext';

const Settings = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const handlePress = () => navigation.navigate('Settings');
  return (
    <TouchableOpacity onPress={handlePress}>
      <Icon name="gears" size={25} />
    </TouchableOpacity>
  );
};

const App = (): React.JSX.Element => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WebSocketProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{gestureEnabled: false, fullScreenGestureEnabled: false}}>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerLeft: () => null,
                }}
              />
              <Stack.Screen
                name="Websocket Chat"
                component={AppScreen}
                options={{
                  headerLeft: () => null,
                  headerRight: Settings,
                  headerBackVisible: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </WebSocketProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
