import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeTokens } from './src/api/apiClient';
import LoginScreen from './src/screens/LoginScreen';    
import SignupScreen from './src/screens/SignupScreen';
import { RootStackParamList } from './src/navigation/types';
import TeamLeaderScreen from './src/screens/TeamLeaderScreen';
import TeamMemberScreen from './src/screens/TeamMemberScreen';
import HomeScreen from './src/screens/HomeScreen';
import BottomTabNavigator from './src/function/BottomTabNavigator'; // ✅ 여기 추가
import SettingsScreen from './src/screens/SettingScreen';
import StartScreen from './src/screens/StartScreen';
import MBTISelector from './src/screens/MbtiScreen';
import MyPageScreen from './src/screens/MypageScreen';
import MissionScreen from './src/screens/MissionScreen';
import QuestionScreen from './src/screens/QuestionScreen';

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
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        /> */}
        {/* 여기에 빈 <Stack.Screen/> 제거 */}
        {/* <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamLeaderScreen"
          component={TeamLeaderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamMemberScreen"
          component={TeamMemberScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="SettingScreen"
          component={SettingsScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
        name="MbtiScreen"
        component={MBTISelector}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="MypageScreen"
        component={MyPageScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="MissionScreen"
        component={MissionScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen name="QuestionScreen"
        component={QuestionScreen} />
      </Stack.Navigator>
      
      <Stack.Navigator>
        <Stack.Screen
          name="QuestionScreen"
          component={QuestionScreen}
          initialParams={{ index: 0 }} // 처음은 0번 질문
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}