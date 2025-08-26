import { useEffect, useState, useContext, useCallback } from "react";
import { Alert } from "react-native";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "../screens/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

// 타입 정의
type Member = {
  userId: number;
  userName: string;
  surveyCompleted: boolean;
};

type MatchingStatus = "idle" | "loading" | "done";

type UseCheckScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CheckScreen">;
};

export const useCheckScreen = ({ navigation }: UseCheckScreenProps) => {
  // 상태 관리
  const [members, setMembers] = useState<Member[]>([]);
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>("idle");

  // 컨텍스트
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId } = useContext(UserContext);

  // 서브그룹 ID 조회
  const fetchSubGroupId = useCallback(async () => {
    if (!teamId || !userId) return;

    try {
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });

      const subGroupId = response.data.subGroupId ?? null;
      setSubGroupIdMap((prev) => ({
        ...prev,
        [teamId]: subGroupId,
      }));

      console.log("최신 subGroupId 업데이트됨:", subGroupId);
    } catch (error) {
      console.error("subGroupId 조회 실패", error);
      setSubGroupIdMap((prev) => ({
        ...prev,
        [teamId]: null,
      }));
    }
  }, [teamId, userId, setSubGroupIdMap]);

  // 팀 멤버 조회
  const fetchMembers = useCallback(async () => {
    if (!teamId) return;

    try {
      const response = await api.get(`/api/team/${teamId}/survey-status/all`);
      setMembers(response.data);

      const teamResponse = await api.get(`/api/team/${teamId}`);
      setIsMatchingStarted(teamResponse.data.matchingStarted);
    } catch (error) {
      console.error("팀원 설문 상태 조회 실패", error);
    }
  }, [teamId]);

  // 홈 화면으로 이동
  const navigateToHome = useCallback(() => {
    if (!teamId) return;

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "HomeScreen",
          params: { teamId },
        },
      ],
    });
  }, [navigation, teamId]);

  // 서브그룹 업데이트
  const handleSubGroupUpdate = useCallback(async () => {
    if (!teamId || !userId) return;

    try {
      const subgroupResponse = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });

      const newSubGroupId = subgroupResponse.data.subGroupId;
      if (newSubGroupId) {
        setSubGroupIdMap((prev) => ({
          ...prev,
          [teamId]: newSubGroupId,
        }));
        console.log("서브 그룹 값 업데이트 되었습니다.");
        return newSubGroupId;
      }
    } catch (error) {
      console.error("서브그룹 업데이트 실패", error);
    }
  }, [teamId, userId, setSubGroupIdMap]);

  // 미션 부여
  const handleMissionAssignment = useCallback(async (subGroupId?: number) => {
    if (!subGroupId) return;

    try {
      await api.post(`/api/missions/assign/subgroup/${subGroupId}`);
      Alert.alert("완료", "그룹 미션이 부여되었습니다!");
    } catch (error) {
      console.error("미션 부여 실패", error);
      Alert.alert("오류", "미션 부여 중 오류가 발생했습니다.");
    }
  }, []);

  // 매칭 시작
  const handleStartMatching = useCallback(async () => {
    if (isMatchingStarted) {
      Alert.alert("알림", "이미 매칭이 되었습니다.");
      return;
    }

    if (!teamId || !userId) {
      Alert.alert("오류", "팀 정보 또는 로그인 정보가 없습니다.");
      return;
    }

    const allCompleted = members.every((member) => member.surveyCompleted);
    if (!allCompleted) {
      Alert.alert("알림", "모든 팀원이 설문을 완료해야 매칭을 시작할 수 있습니다.");
      return;
    }

    try {
      setMatchingStatus("loading");

      const response = await api.post(`/api/matching/start/${teamId}`);

      if (response.data?.matchingStarted) {
        setIsMatchingStarted(true);
        await AsyncStorage.setItem(`@matching_started_team_${teamId}`, "true");

        Alert.alert("완료", "매칭이 완료되었습니다!");

        // 서브그룹 ID 업데이트 및 미션 부여
        const newSubGroupId = await handleSubGroupUpdate();
        if (newSubGroupId) {
          await handleMissionAssignment(newSubGroupId);
        }

        // 홈 화면으로 이동
        setTimeout(() => {
          setMatchingStatus("done");
          navigateToHome();
        }, 2000);
      } else {
        Alert.alert("오류", "매칭이 시작되지 않았습니다.");
        setMatchingStatus("idle");
      }
    } catch (error: any) {
      setMatchingStatus("idle");
      const errorMessage = error.response?.data?.error || "매칭 시작 중 오류가 발생했습니다.";
      Alert.alert("오류", errorMessage);
    }
  }, [teamId, userId, members, isMatchingStarted, handleSubGroupUpdate, handleMissionAssignment, navigateToHome]);

  // 정렬된 멤버 목록
  const sortedMembers = members.sort((a, b) => {
    if (a.surveyCompleted === b.surveyCompleted) return 0;
    return a.surveyCompleted ? 1 : -1;
  });

  // 계산된 값들
  const computed = {
    canStartMatching: members.length >= 2 && !isMatchingStarted,
    allMembersCompleted: members.every((member) => member.surveyCompleted),
    memberCount: members.length,
  };

  // 액션들
  const actions = {
    handleStartMatching,
    navigateToHome,
  };

  // useEffect
  useEffect(() => {
    if (teamId) {
      fetchSubGroupId();
      fetchMembers();
    }
  }, [teamId, fetchSubGroupId, fetchMembers]);

  return {
    state: {
      members: sortedMembers,
      isMatchingStarted,
      matchingStatus,
      teamId,
      userId,
    },
    computed,
    actions,
  };
};
