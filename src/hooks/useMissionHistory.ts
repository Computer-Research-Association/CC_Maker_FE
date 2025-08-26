import { useState, useCallback } from 'react';
import { getMissionHistoryByTeam } from '../api/missionApi';
import { MissionHistory } from '../types/mission';

export const useMissionHistory = (teamId: string, isFocused: boolean) => {
  const [missionHistory, setMissionHistory] = useState<MissionHistory[]>([]);

  const fetchMissionHistory = useCallback(async () => {
    if (!teamId || !isFocused) return;
    
    try {
      console.log("팀 전체 미션 히스토리 조회 시작 - teamId:", teamId);
      const histories = await getMissionHistoryByTeam(Number(teamId));
      console.log("팀 전체 미션 히스토리 조회 결과:", histories);
      
      // 각 미션의 matchedNames 확인
      histories?.forEach((mission: MissionHistory, index: number) => {
        console.log(`미션 ${index + 1}:`, {
          userName: mission.userName,
          matchedNames: mission.matchedNames,
          subGroupName: mission.subGroupName
        });
      });
      
      setMissionHistory(histories || []);
    } catch (error) {
      console.error("팀 전체 미션 히스토리 조회 실패", error);
      setMissionHistory([]);
    }
  }, [teamId, isFocused]);

  return { missionHistory, fetchMissionHistory };
};
