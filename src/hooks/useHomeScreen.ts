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

  // 서브그룹 ID 조회 (매칭 완료 후에만 호출)
  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    // 매칭이 완료된 경우에만 실행
    if (!teamId || !userId) {
      console.log("❌ fetchSubGroupIdIfNeeded 조건 불충족:", { teamId, userId });
      return;
    }

    // 이미 subGroupId가 있으면 스킵
    if (subGroupId) {
      console.log("✅ subGroupId 이미 존재:", subGroupId);
      return;
    }

    // 타입 검사
    if (typeof teamId !== 'number' || typeof userId !== 'number') {
      console.error("❌ fetchSubGroupIdIfNeeded 타입 오류:", { 
        teamId, 
        userId, 
        teamIdType: typeof teamId, 
        userIdType: typeof userId 
      });
      return;
    }

    // 값 범위 검사
    if (teamId <= 0 || userId <= 0) {
      console.error("❌ fetchSubGroupIdIfNeeded 값 범위 오류:", { teamId, userId });
      return;
    }

    setLoading(true);
    try {
      console.log("📡 HomeScreen: subGroupId API 호출 중:", `/api/matching/subgroup/${teamId}`);
      console.log("➡️ 요청 파라미터:", { teamId, userId, teamIdType: typeof teamId, userIdType: typeof userId });
      
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });
      
      const newSubGroupId = response.data.subGroupId ?? null;

      setSubGroupIdMap((prev) => {
        if (prev[teamId] === newSubGroupId) return prev;
        return { ...prev, [teamId]: newSubGroupId };
      });

      console.log("✅ HomeScreen: subGroupId 업데이트 완료:", newSubGroupId);
    } catch (error: any) {
      console.error("❌ subGroupId 조회 실패:", error);
      console.error("❌ 에러 상세 정보:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [teamId, userId, subGroupId, setSubGroupIdMap]);

  // 점수판 데이터 조회
  const fetchScoreboard = useCallback(() => {
    console.log("🎯 fetchScoreboard 호출됨:", { teamId, userId, subGroupId });
    
    // 강화된 유효성 검사
    if (!teamId || !userId) {
      console.log("❌ fetchScoreboard 조건 불충족:", { teamId, userId });
      setError("팀 정보 또는 사용자 정보가 없어 점수판을 불러올 수 없습니다.");
      setScoreboard(null);
      return;
    }

    // subGroupId가 없으면 점수판을 가져올 수 없음
    if (!subGroupId) {
      console.log("⏳ subGroupId 없음, 점수판 가져오기 스킵");
      return;
    }

    // 타입 검사 추가
    if (typeof teamId !== 'number' || typeof userId !== 'number') {
      console.error("❌ fetchScoreboard 타입 오류:", { 
        teamId, 
        userId, 
        teamIdType: typeof teamId, 
        userIdType: typeof userId 
      });
      setError("팀 ID 또는 사용자 ID의 타입이 올바르지 않습니다.");
      setScoreboard(null);
      return;
    }

    // 값 범위 검사
    if (teamId <= 0 || userId <= 0) {
      console.error("❌ fetchScoreboard 값 범위 오류:", { teamId, userId });
      setError("팀 ID 또는 사용자 ID가 유효하지 않습니다.");
      setScoreboard(null);
      return;
    }

    console.log("📡 HomeScreen 점수판 API 호출 중:", `/api/teams/${teamId}/scoreboard`);
    console.log("➡️ 요청 파라미터:", { teamId, userId, teamIdType: typeof teamId, userIdType: typeof userId });
    
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        console.log("✅ HomeScreen Scoreboard API 응답:", res.data);
        console.log("✅ 내 서브그룹 정보:", res.data?.mySubGroup);
        console.log("✅ 내 서브그룹 점수:", res.data?.mySubGroup?.score);
        setScoreboard(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ HomeScreen Scoreboard API 실패:", err);
        console.error("❌ 에러 상세 정보:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            params: err.config?.params,
          }
        });
        
        // 500 에러인 경우 서버 문제로 간주
        if (err.response?.status === 500) {
          console.error("🚨 서버 내부 오류 (500) - 백엔드 팀에 문의 필요");
          setError("서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        }
        setScoreboard(null);
      });
  }, [teamId, userId]);

  // 데이터 초기화
  const initializeData = useCallback(async () => {
    if (!teamId || !userId) return;

    // subGroupId가 없으면 먼저 가져오기
    if (!subGroupId) {
      console.log("⏳ subGroupId 없음, fetchSubGroupIdIfNeeded 호출");
      await fetchSubGroupIdIfNeeded();
      
      // subGroupId를 가져온 후에 scoreboard 가져오기
      // subGroupId가 여전히 없으면 점수판을 가져올 수 없음
      if (!subGroupId) {
        console.log("❌ subGroupId를 가져올 수 없음, 점수판 가져오기 스킵");
        return;
      }
    }

    // scoreboard 가져오기
    console.log("📊 scoreboard 가져오기 시작");
    fetchScoreboard();
  }, [teamId, userId, subGroupId, fetchSubGroupIdIfNeeded, fetchScoreboard]);

  // useFocusEffect
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 HomeScreen 포커스됨, 데이터 초기화 시작");
      console.log("🔄 현재 상태:", { teamId, userId, subGroupId, teamIdType: typeof teamId, userIdType: typeof userId });
      
      initializeData();
      
      // 점수판을 주기적으로 업데이트 (미션 완료 후 상태 반영을 위해)
      const interval = setInterval(() => {
        if (teamId && userId && subGroupId) {
          console.log("⏰ HomeScreen 점수판 자동 업데이트");
          fetchScoreboard();
        } else {
          console.log("⏰ 자동 업데이트 스킵 - 조건 불충족:", { teamId, userId, subGroupId });
        }
      }, 10000); // 10초마다 업데이트

      return () => clearInterval(interval);
      
    }, [initializeData, teamId, userId, subGroupId, fetchScoreboard])
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
