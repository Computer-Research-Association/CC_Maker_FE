import { useState, useCallback } from "react";
import { Alert } from "react-native";

type MbtiType = {
  EI: string;
  SN: string;
  TF: string;
  JP: string;
};

type UseMbtiScreenProps = {
  navigation: any; // 네비게이션 타입은 필요에 따라 수정
};

export const useMbtiScreen = ({ navigation }: UseMbtiScreenProps) => {
  // 상태 관리
  const [mbti, setMbti] = useState<MbtiType>({
    EI: "",
    SN: "",
    TF: "",
    JP: "",
  });

  // MBTI 선택 처리
  const handleSelect = useCallback((key: keyof MbtiType, value: string) => {
    setMbti((prev) => ({ ...prev, [key]: value }));
  }, []);

  // MBTI 문자열 생성
  const getMbtiString = useCallback(() => {
    return mbti.EI + mbti.SN + mbti.TF + mbti.JP;
  }, [mbti]);

  // MBTI 완성 여부 확인
  const isMbtiComplete = useCallback(() => {
    return getMbtiString().length === 4;
  }, [getMbtiString]);

  // MBTI 확인 알림
  const showMbtiConfirmation = useCallback(() => {
    const mbtiString = getMbtiString();
    
    if (!isMbtiComplete()) {
      Alert.alert("선택 부족", "MBTI를 모두 선택해주세요.");
      return;
    }

    Alert.alert(
      "MBTI 확인",
      `당신이 선택한 MBTI가 ${mbtiString}가 맞습니까?`,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: () => {
            navigation.navigate("QuestionScreen", {
              index: 0,
              mbti: mbtiString,
              answers: [],
            });
          },
        },
      ]
    );
  }, [getMbtiString, isMbtiComplete, navigation]);

  // MBTI 옵션 데이터
  const mbtiOptions: Array<{ key: keyof MbtiType; options: string[] }> = [
    { key: "EI", options: ["E", "I"] },
    { key: "SN", options: ["S", "N"] },
    { key: "TF", options: ["T", "F"] },
    { key: "JP", options: ["J", "P"] },
  ];

  // 계산된 값들
  const computed = {
    isComplete: isMbtiComplete(),
    mbtiString: getMbtiString(),
    hasSelection: Object.values(mbti).some(value => value !== ""),
  };

  // 액션들
  const actions = {
    handleSelect,
    showMbtiConfirmation,
  };

  return {
    state: {
      mbti,
      mbtiOptions,
    },
    computed,
    actions,
  };
};
