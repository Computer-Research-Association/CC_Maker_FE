import React from "react";
import { View } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; //네비게이션을 타입안정성있게 쓰기 위한 도구
import styles from "../styles/LoginScreen.styles";
import CherryBlossomContainer from "../component/CherryBlossomContainer";
import { useLoginScreen } from "../hooks/useLoginScreen";
import { LoginForm } from "../component/LoginForm";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
}; //이 컴포넌트는 navigation이라는 prop을 받고, 객체로 타입을 지정해준다.

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const {
    state: { email, password, secure, loading },
    set: { setEmail, setPassword },
    computed: { isSecure },
    actions: { handleLogin, toggleSecure },
  } = useLoginScreen({ navigation });
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
      <CherryBlossomContainer />
      <LoginForm
        email={email}
        password={password}
        secure={isSecure}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onToggleSecure={toggleSecure}
        onLogin={handleLogin}
        onSignup={() => navigation.navigate("Signup")}
      />
    </View>
  );
}
