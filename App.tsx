import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeTokens } from "./src/api/apiClient";
import { RootStackParamList } from "./src/navigation/types";

import HomeScreen from "./src/screens/HomeScreen";
import BottomTabNavigator from "./src/function/BottomTabNavigator";
import SettingsScreen from "./src/screens/SettingScreen";
import StartScreen from "./src/screens/StartScreen";
import MBTISelector from "./src/screens/MbtiScreen";
import InviteScreen from "./src/screens/InviteScreen";
import MyPageScreen from "./src/screens/MypageScreen";
import MainHomeScreen from "./src/screens/MainHomeScreen";
import MissionScreen from "./src/screens/MissionScreen";
import JoinScreen from "./src/screens/JoinScreen";
import login from "./src/screens/LoginScreen";
import QuestionScreen from "./src/screens/QuestionScreen";
import signup from "./src/screens/SignupScreen";
import { TeamProvider } from "./src/screens/TeamContext";
import CheckScreen from "./src/screens/CheckScreen";

// 새로 만든 UserContext import
import { UserProvider } from "./src/screens/UserContext";

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
    return null;
  }

  return (
    <NavigationContainer>
      <UserProvider>
        <TeamProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={signup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainHomeScreen"
              component={MainHomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={BottomTabNavigator}
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
            <Stack.Screen
              name="QuestionScreen"
              component={QuestionScreen}
              initialParams={{ index: 0 }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SettingScreen"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckScreen"
              component={CheckScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </TeamProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
