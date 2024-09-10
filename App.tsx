// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './App/login'
import MarketDataScreen from './App/marketdata';
import MarketDataScreen1 from './App/marketdata1';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'purple' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Welcome',
        }}
      />
      <Stack.Screen
        name="Market"
        component={MarketDataScreen}
        options={{
          title: 'Market',
        }}
      />
      <Stack.Screen
        name="Market1"
        component={MarketDataScreen1}
        options={({ route }) => ({ title: route.params.symbol })}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;