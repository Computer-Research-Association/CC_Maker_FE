import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeTokens } from './src/api/apiClient';
import LoginScreen from './src/screens/LoginScreen';    
import SignupScreen from './src/screens/SignupScreen';
import { RootStackParamList } from './src/navigation/types';
import TeamLeaderScreen from './src/screens/TeamLeaderScreen';
import JoinTeamScreen from './src/screens/JoinTeamScreen';
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
        <Stack.Screen
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={TeamLeaderScreen}
          options={{ headerShown: false }} //name에 해당하는 배너가 뜨지 않음
        /> */}
        <Stack.Screen
          name="JoinTeam"
          component={JoinTeamScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
