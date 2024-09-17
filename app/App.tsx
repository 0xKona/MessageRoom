import React from 'react';
import AppScreen from './screens/app-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login-screen';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { RootStackParamList } from '../types/navigation-types';
import { PersistGate } from 'redux-persist/integration/react';

const App = (): React.JSX.Element => {

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{
              headerLeft: () => null,
            }}/>
            <Stack.Screen name="Websocket Chat" component={AppScreen} options={{
              headerLeft: () => null,
              headerBackVisible: false,
            }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
