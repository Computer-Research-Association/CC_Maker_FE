import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';    
import SignupScreen from './src/screens/SignupScreen';
import { RootStackParamList } from './src/navigation/types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TeamLeaderScreen from './src/screens/TeamLeaderScreen';
// import TeamMemberScreen from './src/screens/TeamMemberScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={TeamLeaderScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Member"
          component={TeamMemberScreen}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
