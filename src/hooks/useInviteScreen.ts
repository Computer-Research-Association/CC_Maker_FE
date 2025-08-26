import { useState, useCallback, useContext } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";

type UseInviteScreenProps = {
  teamId: number | null;
  setTeamId: (id: number | null) => void;
};

export const useInviteScreen = ({ teamId, setTeamId }: UseInviteScreenProps) => {
  // 상태 관리
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 초대코드 생성
  const fetchInviteCode = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetchInviteCode 실행");

      // auth_tokens에서 accessToken 추출
      const tokenData = await SecureStore.getItemAsync("auth_tokens");
      const accessToken = tokenData ? JSON.parse(tokenData).accessToken : null;

      console.log("정상적으로 작동하는토큰 :", accessToken);

      if (!accessToken) {
        Alert.alert("로그인 필요", "로그인 후 이용해주세요.");
        setLoading(false);
        return;
      }

      const response = await api.post("/api/invitecode/create", {
        teamId: teamId,
      });

      if (response.data?.code) {
        setTeamCode(response.data.code);
        setSuccessMessage("초대코드가 생성되었습니다.");
        setSuccessModalVisible(true);
      } else {
        Alert.alert("오류", "초대코드 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("초대코드 생성 실패:", error);
      Alert.alert("오류", "초대코드 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // 성공 모달 닫기
  const closeSuccessModal = useCallback(() => {
    setSuccessModalVisible(false);
  }, []);

  // 초대코드 복사
  const copyToClipboard = useCallback(async () => {
    if (teamCode) {
      await Clipboard.setStringAsync(teamCode);
      setSuccessMessage("팀 코드가 복사되었습니다!");
      setSuccessModalVisible(true);
    }
  }, [teamCode]);

  // 팀 이름 저장 (실제 팀 생성은 아님)
  const onCreateTeam = useCallback(async () => {
    if (!teamName.trim()) {
      Alert.alert("입력 오류", "팀 이름을 입력해주세요.");
      return;
    }

    // 팀 이름만 저장하고 2단계로 이동
    setStep(2);
  }, [teamName]);

  // 실제 팀 생성 (시작하기 버튼 클릭 시)
  const onStartTeam = useCallback(async () => {
    if (!teamName.trim()) {
      Alert.alert("입력 오류", "팀 이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/invitecode/teamname", {
        teamName: teamName,
      });

      console.log("팀 생성 응답:", JSON.stringify(response, null, 2));

      if (!response.data) {
        Alert.alert("오류", "서버에서 데이터를 받지 못했습니다.");
        return;
      }

      const { teamId: newTeamId, teamName: savedTeamName } = response.data;

      if (newTeamId) {
        setTeamId(newTeamId);
        console.log("✅ teamId 저장됨:", newTeamId);
        // 팀 생성 성공 후 MainHomeScreen으로 이동
        return true;
      } else {
        Alert.alert("오류", "팀 생성 후 teamId를 가져오지 못했습니다.");
        return false;
      }
    } catch (error) {
      console.error("팀 생성 실패:", error);
      Alert.alert("오류", "팀 생성에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [teamName, setTeamId]);

  // 계산된 값들
  const computed = {
    canCreateTeam: teamName.trim().length > 0,
    hasTeamCode: teamCode !== "",
    isStepOne: step === 1,
    isStepTwo: step === 2,
  };

  // 액션들
  const actions = {
    fetchInviteCode,
    copyToClipboard,
    onCreateTeam,
    onStartTeam,
  };

  return {
    state: {
      teamName,
      teamCode,
      loading,
      step,
      successModalVisible,
      successMessage,
    },
    set: {
      setTeamName,
      setStep,
    },
    computed,
    actions: {
      ...actions,
      closeSuccessModal,
    },
  };
};
