import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeTokens } from './src/api/apiClient';
import LoginScreen from './src/screens/LoginScreen';    
import SignupScreen from './src/screens/SignupScreen';
import { RootStackParamList } from './src/navigation/types';
import InviteScreen from './src/screens/InviteScreen';
import JoinScreen from './src/screens/JoinScreen';
import Home from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeTokens();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return null; // 또는 로딩 스피너 등 렌더링
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* 여기에 빈 <Stack.Screen/> 제거 */}
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        {/* 여기에 빈 <Stack.Screen/> 제거 */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InviteScreen"
          component={InviteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinScreen"
          component={JoinScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}