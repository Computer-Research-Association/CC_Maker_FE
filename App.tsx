import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeTokens } from './src/api/apiClient';
import { RootStackParamList } from './src/navigation/types';

import HomeScreen from './src/screens/HomeScreen';
import BottomTabNavigator from './src/function/BottomTabNavigator'; // ✅ 여기 추가
import SettingsScreen from './src/screens/SettingScreen';
import StartScreen from './src/screens/StartScreen';
import MBTISelector from './src/screens/MbtiScreen';
import InviteScreen from './src/screens/InviteScreen';
import JoinScreen from './src/screens/JoinScreen';
import login from './src/screens/LoginScreen';
import signup from './src/screens/SignupScreen';
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
          component={login}
          options={{ headerShown: false }}
        />
    
        {/* {<Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />} */}
         <Stack.Screen
          name="Signup"
          component={signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
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