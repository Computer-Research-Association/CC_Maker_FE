import { useContext, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "../screens/UserContext";
import api from "../api/apiClient";

// 타입 정의
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

type UseHomeScreenProps = {
  teamId: number | null;
  userId: number | null;
  subGroupId: number | null;
  setSubGroupIdMap: (updater: (prev: Record<number, number | null>) => Record<number, number | null>) => void;
};

export const useHomeScreen = ({ teamId, userId, subGroupId, setSubGroupIdMap }: UseHomeScreenProps) => {
  // 상태 관리
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 서브그룹 ID 조회
  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    if (!teamId || !userId || subGroupId) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });
      
      const newSubGroupId = response.data.subGroupId ?? null;

      setSubGroupIdMap((prev) => {
        if (prev[teamId] === newSubGroupId) return prev;
        return { ...prev, [teamId]: newSubGroupId };
      });

      console.log("✅ HomeScreen: subGroupId 업데이트 완료:", newSubGroupId);
    } catch (error) {
      console.error("subGroupId 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId, userId, subGroupId, setSubGroupIdMap]);

  // 점수판 데이터 조회
  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;

    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        console.log("✅ Scoreboard API 응답:", res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        setScoreboard(null);
      });
  }, [teamId, userId]);

  // 데이터 초기화
  const initializeData = useCallback(async () => {
    if (!teamId || !userId) return;

    // subGroupId가 없으면 먼저 가져오기
    if (!subGroupId) {
      await fetchSubGroupIdIfNeeded();
    }

    // scoreboard 가져오기
    fetchScoreboard();
  }, [teamId, userId, subGroupId, fetchSubGroupIdIfNeeded, fetchScoreboard]);

  // useFocusEffect
  useFocusEffect(
    useCallback(() => {
      initializeData();
    }, [initializeData])
  );

  // 계산된 값들
  const computed = {
    hasSubGroup: !!subGroupId,
    hasScoreboard: !!scoreboard,
    hasError: !!error,
    isLoading: loading,
  };

  // 액션들
  const actions = {
    fetchSubGroupIdIfNeeded,
    fetchScoreboard,
    initializeData,
  };

  return {
    state: {
      scoreboard,
      loading,
      error,
    },
    computed,
    actions,
  };
};
