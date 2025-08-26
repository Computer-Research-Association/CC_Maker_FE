import { useState, useCallback } from 'react';
import api from '../api/apiClient';

export const useMatchingInfo = (
  teamId: string, 
  userId: string, 
  isFocused: boolean,
  setSubGroupIdMap: (updater: any) => void
) => {
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const [subGroupId, setSubGroupId] = useState<string | null>(null);

  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    if (!teamId || !isFocused || !userId) return;
    
    try {
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });
      const newSubGroupId = response.data.subGroupId?.toString() ?? null;
      setSubGroupId(newSubGroupId);
      setSubGroupIdMap((prev: any) => {
        if (prev[teamId] === newSubGroupId) return prev;
        return { ...prev, [teamId]: newSubGroupId };
      });
    } catch (error) {
      console.error("subGroupId 조회 실패", error);
    }
  }, [teamId, isFocused, userId, setSubGroupIdMap]);

  const fetchMatchedNames = useCallback(async () => {
    if (!teamId || !subGroupId || !isFocused || !userId) return;
    
    try {
      const response = await api.get(
        `/api/matching/matched-names/${teamId}`,
        { params: { userId } }
      );
      setMatchedNames(response.data.matchedNames || []);
    } catch (error) {
      console.error("매칭된 이름 조회 실패", error);
    }
  }, [teamId, subGroupId, isFocused, userId]);

  return { 
    matchedNames, 
    subGroupId, 
    fetchSubGroupIdIfNeeded, 
    fetchMatchedNames 
  };
};
