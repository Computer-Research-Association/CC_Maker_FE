import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity, View, Platform } from "react-native"; // 수정: Platform 추가

// 각 화면 import
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import MyPageScreen from "../screens/MypageScreen";
import MissionScreen from "../screens/MissionScreen";
// import ProfileScreen from '../screens/ProfileScreen';

// 25.08.07 추가
import NeonProgressTestScreen from "../screens/TestScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, // 아이콘 밑에 글씨 보이게
        tabBarActiveTintColor: "#000", // 선택 시 색상 조정
        tabBarInactiveTintColor: "#bbb", // 비선택 시 색
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 90,
          position: "absolute", // 요소 위치 부모 기준 배치
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 10, // 아래 여백
          paddingTop: 5,

          // 플랫폼별 그림자 적용
          ...Platform.select({
            ios: {
              shadowColor: "#000", // 그림자 색상
              shadowOffset: { width: 0, height: -3 }, // 그림자 위치 (위로 올라가면 음영 위에 생김)
              shadowOpacity: 0.03, // 그림자 투명도 (0 = 없음, 1 = 완전 검정)
              shadowRadius: 8, // 퍼짐 정도 (값 클수록 더 흐림)
            },
            android: {
              elevation: 10, // Android 그림자 세기 조절
            },
          }),
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={props.onPress}
            style={props.style}
          >
            <View>{props.children}</View>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          switch (route.name) {
            case "Home":
              iconName = "fitness-outline";
              break;
            case "Login":
              iconName = "log-in-outline";
              break;
            case "Signup":
              iconName = "grid-outline";
              break;
            case "Profile":
              iconName = "heart-outline";
              break;

            // 25.08.07 추가
            case "NeonTest":
              iconName = "color-wand-outline"; // 네온 느낌의 아이콘
              break;
          }

          return (
            <Ionicons name={iconName} size={focused ? 28 : 24} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈" }} // 텍스트 바꾸고 싶으면 여기서 설정
      />
      <Tab.Screen
        name="Signup"
        component={MissionScreen}
        options={{ title: "미션" }}
      />
      <Tab.Screen
        name="Profile"
        component={MyPageScreen}
        options={{ title: "프로필" }}
      />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}

      {/* 25.08.07 추가 */}
      <Tab.Screen
        name="NeonTest"
        component={NeonProgressTestScreen}
        options={{ title: "네온" }}
      />
    </Tab.Navigator>
  );
}
