import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback } from "react-native";
import { TouchableOpacity, View } from "react-native";

// 각 화면 import
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import MyPageScreen from "../screens/MypageScreen";
import MissionScreen from "../screens/MissionScreen";
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 100,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            activeOpacity={0.6} // 누를 때 투명도
            onPress={props.onPress}
            style={props.style} // 탭 스타일 유지
          >
            <View>{props.children}</View>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Login":
              iconName = "log-in-outline";
              break;
            case "Signup":
              iconName = "person-add-outline";
              break;
            case "Profile":
              iconName = "person";
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 28 : 24}
              color={focused ? "#333" : "#bbb"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Signup" component={MissionScreen} />
      <Tab.Screen name="Profile" component={MyPageScreen} />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}
