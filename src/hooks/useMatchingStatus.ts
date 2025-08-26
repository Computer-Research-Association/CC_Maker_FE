import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMatchingStatus = (teamId: string) => {
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);

  const checkMatchingStatus = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(
        `@matching_started_team_${teamId}`
      );
      if (value === "true") {
        setIsMatchingStarted(true);
      }
    } catch (error) {
      console.warn("AsyncStorage 불러오기 실패", error);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      checkMatchingStatus();
    }
  }, [teamId, checkMatchingStatus]);

  return { isMatchingStarted };
};
