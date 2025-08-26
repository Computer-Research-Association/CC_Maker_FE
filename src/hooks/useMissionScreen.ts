import { useState, useCallback, useContext, useRef, useEffect } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "../screens/UserContext";
import api from "../api/apiClient";

type SubGroupScore = {
  subGroupId: number;
  name: string;
  score: number;
  members: string[];
};

type ScoreboardResponse = {
  minScore: number;
  mySubGroup: SubGroupScore;
  otherSubGroups: SubGroupScore[];
};

type Mission = {
  subGroupMissionId: number;
  missionTemplateId: number;
  title: string;
  description: string;
  score: number;
  completed: boolean;
};

const celebrateKey = (
  teamId?: number | null,
  subGroupId?: number | null,
  min?: number | null
) => `celebrated:${teamId ?? "na"}:${subGroupId ?? "na"}:${min ?? 0}`;

export const useMissionScreen = () => {
  // 컨텍스트
  const { role, teamId, subGroupIdMap, teamName } = useContext(TeamContext);
  const { userId } = useContext(UserContext);

  // 상태 관리
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [sbLoading, setSbLoading] = useState(false);
  const [sbError, setSbError] = useState<string | null>(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // refs
  const prevMinScoreRef = useRef<number | null>(null);
  const celebratedMinScoreRef = useRef<number | null>(null);

  // 계산된 값들
  const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;

  // 점수판 가져오기
  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;
    setSbLoading(true);
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        setSbError(null);
      })
      .catch((err) => {
        setScoreboard(null);
        setSbError(err?.message ?? "점수판 불러오기 실패");
      })
      .finally(() => setSbLoading(false));
  }, [teamId, userId]);

  // 미션 가져오기
  const fetchMissions = useCallback(async () => {
    if (!teamId || !subGroupId) return;

    try {
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      if (res.data.length === 0) {
        await api.post(`/api/missions/assign/subgroup/${subGroupId}`);
        const newRes = await api.get(`/api/missions/subgroup/${subGroupId}`);
        setMissions(newRes.data);
      } else {
        setMissions(res.data);
      }
    } catch (err) {
      console.error("❌ 미션 불러오기 실패:", err);
    }
  }, [teamId, subGroupId]);

  // 달성 판정 헬퍼
  const isAchieved = useCallback((data: ScoreboardResponse | null) => {
    if (!data) return false;
    const { minScore, mySubGroup } = data;
    return minScore > 0 && (mySubGroup?.score ?? 0) >= minScore;
  }, []);

  // 축하 상태 로드
  const loadCelebration = useCallback(async () => {
    if (!scoreboard || !teamId || !subGroupId) return;
    const key = celebrateKey(teamId, subGroupId, scoreboard.minScore);
    const v = await AsyncStorage.getItem(key);
    celebratedMinScoreRef.current = v ? scoreboard.minScore : null;
  }, [scoreboard?.minScore, teamId, subGroupId]);

  // 미션 완료 처리
  const handleComplete = useCallback(async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];

    try {
      setLoading(true);
      
      // 완료 처리
      await api.post("/api/missions/complete", {
        teamId,
        subGroupId,
        missionId: mission.missionTemplateId,
      });

      // 낙관적 업데이트
      setMissions(prev =>
        prev.map((m, i) => (i === selectedBoxIndex ? { ...m, completed: true } : m))
      );

      // 최신 점수판 가져오기
      const { data: freshSb } = await api.get(`/api/teams/${teamId}/scoreboard`, {
        params: { userId, _ts: Date.now() },
      });
      setScoreboard(freshSb);

      Alert.alert(mission.title, "미션이 완료처리되었습니다.");

      const currentMin = freshSb?.minScore ?? 0;
      const alreadyCelebratedForThisMin =
        celebratedMinScoreRef.current === currentMin;

      if (isAchieved(freshSb) && !alreadyCelebratedForThisMin) {
        setModalVisible(false);
        celebratedMinScoreRef.current = currentMin;
        
        // 저장
        const key = celebrateKey(teamId, subGroupId, currentMin);
        AsyncStorage.setItem(key, "1").catch(() => {});
        setTimeout(() => setShowCongratsModal(true), 0);
      } else {
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("오류", "미션 완료 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedBoxIndex, missions, teamId, subGroupId, userId, isAchieved]);

  // 미션 새로고침
  const confirmRefresh = useCallback(async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];

    try {
      setLoading(true);
      
      await api.post(
        `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
      );
      
      Alert.alert("새로고침 완료", `${mission.title} 미션이 새로고침되었습니다.`);
      
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      Alert.alert("오류", "미션 새로고침에 실패했습니다.");
    } finally {
      setLoading(false);
      setConfirmModalVisible(false);
    }
  }, [selectedBoxIndex, missions, subGroupId]);

  // 미션 박스 클릭
  const handleBoxPress = useCallback((index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setConfirmModalVisible(false);
    setSelectedBoxIndex(null);
  }, []);

  // 축하 모달 닫기
  const closeCongratsModal = useCallback(() => {
    setShowCongratsModal(false);
  }, []);

  // 화면 포커스 시 데이터 최신화
  useFocusEffect(
    useCallback(() => {
      fetchScoreboard();
      
      if (missions.length === 0) {
        fetchMissions();
      }
      
      if (scoreboard?.minScore !== prevMinScoreRef.current) {
        loadCelebration();
      }
    }, [fetchScoreboard, fetchMissions, loadCelebration, missions.length, scoreboard?.minScore])
  );

  // 이전 최소학점 추적
  useEffect(() => {
    if (scoreboard?.minScore !== prevMinScoreRef.current) {
      prevMinScoreRef.current = scoreboard?.minScore ?? null;
    }
  }, [scoreboard?.minScore]);

  // 계산된 값들
  const computed = {
    isLoading: loading || sbLoading,
    hasError: !!error || !!sbError,
    canShowMissions: !!teamId && !!subGroupId && !!scoreboard,
    needsMatching: !teamId || !subGroupId,
    needsMinScore: !!teamId && !!subGroupId && !scoreboard,
    missionCount: missions.length,
    completedCount: missions.filter(m => m.completed).length,
  };

  // 액션들
  const actions = {
    handleBoxPress,
    handleComplete,
    confirmRefresh,
    closeModal,
    closeCongratsModal,
    setConfirmModalVisible,
  };

  return {
    state: {
      missions,
      selectedBoxIndex,
      modalVisible,
      confirmModalVisible,
      scoreboard,
      showCongratsModal,
      teamName,
    },
    computed,
    actions,
  };
};
