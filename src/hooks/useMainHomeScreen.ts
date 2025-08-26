import { useState, useCallback, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { TeamResponseDto } from "../types/team";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";

type Role = "MEMBER" | "LEADER";

interface Team {
  id: number;
  teamName: string;
  role: Role;
}

type UseMainHomeScreenProps = {
  navigation: any; // 네비게이션 타입은 필요에 따라 수정
};

export const useMainHomeScreen = ({ navigation }: UseMainHomeScreenProps) => {
  // 상태 관리
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 컨텍스트
  const { setTeamId, setRole, setTeamName } = useContext(TeamContext);

  // 팀 목록 가져오기
  const fetchUserTeams = useCallback(async () => {
    try {
      setLoading(true);
      console.log("passhere");
      const response = await api.get<TeamResponseDto[]>("/api/team/mine");
      console.log("passhere1");
      console.log("여기에요 여기:", response.data);

      const mappedTeams = response.data.map((team) => ({
        id: team.teamId,
        teamName: team.teamName,
        role: team.role,
      }));
      console.log("passhere2");

      setTeams(mappedTeams);
    } catch (error) {
      console.log("passhere in catch");
      console.error("팀 목록 불러오기 실패", error);
      Alert.alert("오류", "팀 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 팀 선택 처리
  const handleTeamSelect = useCallback((team: Team) => {
    console.log(
      `선택한 팀 ID: ${team.id}, 팀 이름: ${team.teamName}, role: ${team.role}`
    );
    
    setTeamId(team.id);
    setRole(team.role);
    setTeamName(team.teamName);
    
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "HomeScreen",
          params: { teamId: team.id },
        },
      ],
    });
  }, [setTeamId, setRole, setTeamName, navigation]);

  // 팀 생성 모달 열기
  const openCreateTeamModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  // 팀 생성 모달 닫기
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // 팀 생성하기
  const handleCreateTeam = useCallback(() => {
    closeModal();
    navigation.navigate("InviteScreen");
  }, [closeModal, navigation]);

  // 팀 참여하기
  const handleJoinTeam = useCallback(() => {
    closeModal();
    navigation.navigate("JoinScreen");
  }, [closeModal, navigation]);

  // 로그아웃 처리
  const handleLogout = useCallback(() => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        }
      ]
    );
  }, [navigation]);

  // 초기 데이터 로드
  useEffect(() => {
    console.log("✅ useEffect 실행됨");
    fetchUserTeams();
  }, [fetchUserTeams]);

  // 계산된 값들
  const computed = {
    isLoading: loading,
    hasTeams: teams.length > 0,
    teamCount: teams.length,
  };

  // 액션들
  const actions = {
    handleTeamSelect,
    openCreateTeamModal,
    closeModal,
    handleCreateTeam,
    handleJoinTeam,
    handleLogout,
    fetchUserTeams,
  };

  return {
    state: {
      teams,
      modalVisible,
    },
    computed,
    actions,
  };
};
