import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { joinTeamByCode } from "../api/teamApi";

type UseJoinScreenProps = {
  navigation: any; // 네비게이션 타입은 필요에 따라 수정
};

export const useJoinScreen = ({ navigation }: UseJoinScreenProps) => {
  // 상태 관리
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 팀 가입 처리
  const handleJoinTeam = useCallback(async () => {
    if (!code.trim()) {
      Alert.alert("입력 오류", "초대코드를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await joinTeamByCode(code);
      Alert.alert("팀 가입 완료", "성공적으로 팀에 가입했습니다!");
      navigation.navigate("MainHomeScreen");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("가입 실패", error.message);
      } else {
        Alert.alert("가입 실패", "팀 가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [code, navigation]);

  // 계산된 값들
  const computed = {
    canJoinTeam: code.trim().length > 0,
    isLoading: loading,
  };

  // 액션들
  const actions = {
    handleJoinTeam,
  };

  return {
    state: {
      code,
      loading,
    },
    set: {
      setCode,
    },
    computed,
    actions,
  };
};
