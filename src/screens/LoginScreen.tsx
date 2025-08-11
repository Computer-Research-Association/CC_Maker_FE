import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; //네비게이션을 타입안정성있게 쓰기 위한 도구
import { login } from "../api/authApi";
import styles from "../styles/LoginScreen.styles";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "./UserContext"; // 경로 맞게 수정
import { Ionicons } from "@expo/vector-icons"; // 비밀번호 토글

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
}; //이 컴포넌트는 navigation이라는 prop을 받고, 객체로 타입을 지정해준다.

export default function LoginScreen({ navigation }: LoginScreenProps) {
  //react는 객체로 props를 받음
  const [email, setemail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setTeamId, setSubGroupIdMap } = useContext(TeamContext);
  const { setUserId, setName } = useContext(UserContext);
  const [secure, setSecure] = useState(true); // 비밀번호 토글

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      Alert.alert("로그인 성공", "환영합니다!");

      console.log("🧾 로그인 응답:", response);

      setUserId(response.userId);
      setName(response.name);
      setTeamId(null);
      setSubGroupIdMap({});
      //
      navigation.reset({
        index: 0,
        routes: [{ name: "MainHomeScreen" }],
      });
    } catch (error: unknown) {
      console.log("🚨 로그인 에러 발생:", error);
      console.log("🚨 에러 타입:", typeof error);
      console.log("🚨 에러 객체:", JSON.stringify(error, null, 2));
      
      let errorMessage = "로그인에 실패했어요.";
      
      if (error instanceof Error) {
        const msg = error.message;
        console.log("🔍 로그인 에러 메시지:", msg); // 디버깅용
        
        if (msg.includes("비밀번호") || msg.includes("password") || msg.includes("Password")) {
          errorMessage = "비밀번호가 올바르지 않아요.";
        } else if (msg.includes("이메일") || msg.includes("email") || msg.includes("Email")) {
          errorMessage = "등록되지 않은 이메일이에요.";
        } else if (msg.includes("계정") || msg.includes("account") || msg.includes("Account")) {
          errorMessage = "계정을 찾을 수 없어요.";
        } else if (msg.includes("인증") || msg.includes("authentication") || msg.includes("Authentication")) {
          errorMessage = "이메일 또는 비밀번호가 올바르지 않아요.";
        } else if (msg.includes("잘못") || msg.includes("incorrect") || msg.includes("Incorrect")) {
          errorMessage = "이메일 또는 비밀번호가 올바르지 않아요.";
        } else {
          errorMessage = msg;
        }
      } else {
        console.log("🚨 Error 인스턴스가 아님:", error);
        errorMessage = "알 수 없는 오류가 발생했어요.";
      }
      
      console.log("📱 최종 에러 메시지:", errorMessage);
      Alert.alert("로그인 실패", errorMessage);
    }
  };
  //

  // const handleLogin = async () => {
  //   try {
  //     const response = await login({ email, password });

  //     // ✅ 토큰 꺼내서 저장
  //     const token = response.token; // 👉 이 부분은 백엔드 응답에 따라 조정 (아래 설명 참고)
  //     await AsyncStorage.setItem("ACCESS_TOKEN", token);
  //     console.log("✅ ACCESS_TOKEN 저장됨:", token);

  //     Alert.alert("로그인 성공", "환영합니다!");
  //     setUserId(response.userId);
  //     setName(response.name);
  //     setTeamId(null);
  //     setSubGroupIdMap({});

  //     navigation.navigate("MainHomeScreen");
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "알 수 없는 오류";
  //     Alert.alert("로그인 실패", errorMessage);
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/sco/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/768px-Starbucks_Corporation_Logo_2011.svg.png',
        }}
        style={styles.logo}
      /> */}

      <Text style={styles.subText}>팀cc맞춤형 플랫폼</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={email}
        onChangeText={setemail}
        autoCapitalize="none"
      />

      {/* 비밀번호 토글 기능 수정 */}
      <View
        style={[
          styles.input,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <TextInput
          style={{ flex: 1 }}
          placeholder="비밀번호"
          secureTextEntry={secure} // 위의 secure 상태값 사용
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="gray" />
        </TouchableOpacity>
      </View>
      {/* 수정완 25.07.25 박진우 */}

      <View style={styles.linkRow}>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>회원가입</Text>
        </TouchableOpacity>
        {/* <Text style={styles.separator}>|</Text> */}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인하기</Text>
      </TouchableOpacity>
    </View>
  );
}
