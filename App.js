import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';


import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={ {headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={ {headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
