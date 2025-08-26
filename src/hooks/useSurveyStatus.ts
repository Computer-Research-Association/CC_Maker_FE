import { useState, useCallback } from 'react';
import api from '../api/apiClient';

export const useSurveyStatus = (teamId: string, userId: string, isFocused: boolean) => {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  const checkSurveyStatus = useCallback(async () => {
    if (!teamId || !userId || !isFocused) return;
    
    try {
      const response = await api.get(`/api/team/${teamId}/survey-status/all`);
      const userStatus = response.data.find((member: any) => member.userId === userId);
      if (userStatus) {
        setIsSurveyCompleted(userStatus.surveyCompleted);
      }
    } catch (error) {
      console.error("설문 상태 조회 실패", error);
    }
  }, [teamId, userId, isFocused]);

  return { isSurveyCompleted, checkSurveyStatus };
};
