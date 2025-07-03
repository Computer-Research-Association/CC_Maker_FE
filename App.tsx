import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';    
import SignupScreen from './src/screens/SignupScreen';
import { RootStackParamList } from './src/navigation/types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TeamLeaderScreen from './src/screens/TeamLeaderScreen';
import JoinTeamScreen from './src/screens/JoinTeamScreen';
import HomeScreen from './src/screens/HomeScreen';
import PrivateScreen from './src/screens/PrivateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator >
        {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="leader"
          component={TeamLeaderScreen}
          options={{ headerShown: false }} //name에 해당하는 배너가 뜨지 않음
        />
        <Stack.Screen
          name="JoinTeam"
          component={JoinTeamScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="private"
          component={PrivateScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
