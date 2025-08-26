import { useState, useCallback, useContext } from "react";
import { Alert } from "react-native";
import { login } from "../api/authApi";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "../screens/UserContext";

type UseLoginScreenProps = {
  navigation: any; // 네비게이션 타입은 필요에 따라 수정
};

export const useLoginScreen = ({ navigation }: UseLoginScreenProps) => {
  // 상태 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // 컨텍스트
  const { setTeamId, setSubGroupIdMap } = useContext(TeamContext);
  const { setUserId, setName } = useContext(UserContext);

  // 에러 메시지 처리
  const getErrorMessage = useCallback((errorMessage: string): string => {
    if (errorMessage.includes("비밀번호") || errorMessage.includes("password") || errorMessage.includes("Password")) {
      return "비밀번호가 올바르지 않아요.";
    } else if (errorMessage.includes("이메일") || errorMessage.includes("email") || errorMessage.includes("Email")) {
      return "등록되지 않은 이메일이에요.";
    } else if (errorMessage.includes("계정") || errorMessage.includes("account") || errorMessage.includes("Account")) {
      return "계정을 찾을 수 없어요.";
    } else if (errorMessage.includes("인증") || errorMessage.includes("authentication") || errorMessage.includes("Authentication")) {
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    } else if (errorMessage.includes("잘못") || errorMessage.includes("incorrect") || errorMessage.includes("Incorrect")) {
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    } else {
      return errorMessage;
    }
  }, []);

  // 로그인 처리
  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });
      
      Alert.alert("로그인 성공", "환영합니다!");
      console.log("로그인 응답:", response);

      // 사용자 정보 설정
      setUserId(response.userId);
      setName(response.name);
      
      // 팀 정보 초기화
      setTeamId(null);
      setSubGroupIdMap({});

      // 홈 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: "MainHomeScreen" }],
      });
    } catch (error: unknown) {
      console.log("로그인 에러 발생:", error);
      console.log("에러 타입:", typeof error);
      console.log("에러 객체:", JSON.stringify(error, null, 2));
      
      let errorMessage = "로그인에 실패했어요.";
      
      if (error instanceof Error) {
        const msg = error.message;
        console.log("🔍 로그인 에러 메시지:", msg);
        errorMessage = getErrorMessage(msg);
      } else {
        console.log("🚨 Error 인스턴스가 아님:", error);
        errorMessage = "알 수 없는 오류가 발생했어요.";
      }
      
      console.log("📱 최종 에러 메시지:", errorMessage);
      Alert.alert("로그인 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, setUserId, setName, setTeamId, setSubGroupIdMap, navigation, getErrorMessage]);

  // 비밀번호 토글
  const toggleSecure = useCallback(() => {
    setSecure(prev => !prev);
  }, []);

  // 계산된 값들
  const computed = {
    canLogin: email.trim().length > 0 && password.trim().length > 0,
    isLoading: loading,
    isSecure: secure,
  };

  // 액션들
  const actions = {
    handleLogin,
    toggleSecure,
  };

  return {
    state: {
      email,
      password,
      secure,
      loading,
    },
    set: {
      setEmail,
      setPassword,
    },
    computed,
    actions,
  };
};
