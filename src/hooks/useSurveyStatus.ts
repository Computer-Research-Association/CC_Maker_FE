import { useState, useCallback } from 'react';
import api from '../api/apiClient';

export const useSurveyStatus = (teamId: string, userId: string, isFocused: boolean) => {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  const checkSurveyStatus = useCallback(async () => {
    if (!teamId || !userId || userId === "" || !isFocused) {
      console.log("설문 상태 확인 조건 불충족:", { teamId, userId, isFocused });
      return;
    }
    
    try {
      console.log("설문 상태 확인 중...", { teamId, userId, userIdType: typeof userId });
      const response = await api.get(`/api/team/${teamId}/survey-status/all`);
      console.log("설문 상태 응답 전체:", response.data);
      console.log("응답 데이터 타입:", typeof response.data);
      console.log("응답 데이터 길이:", Array.isArray(response.data) ? response.data.length : "배열 아님");
      
      if (Array.isArray(response.data)) {
        response.data.forEach((member: any, index: number) => {
          console.log(`멤버 ${index}:`, {
            memberUserId: member.userId,
            memberUserIdType: typeof member.userId,
            surveyCompleted: member.surveyCompleted,
            전체멤버: member
          });
        });
        
        // userId를 숫자로 변환해서 비교
        const numericUserId = parseInt(userId, 10);
        console.log("변환된 userId:", numericUserId);
        
        const userStatus = response.data.find((member: any) => {
          const memberUserId = parseInt(member.userId, 10);
          const matches = memberUserId === numericUserId;
          console.log(`비교: ${memberUserId} === ${numericUserId} = ${matches}`);
          return matches;
        });
        
        console.log("찾은 사용자 설문 상태:", userStatus);
        
        if (userStatus) {
          const completed = userStatus.surveyCompleted;
          console.log("설문 완료 여부:", completed);
          setIsSurveyCompleted(completed);
        } else {
          console.log("사용자 설문 상태를 찾을 수 없음");
          console.log("가능한 원인:");
          console.log("- userId 타입 불일치 (string vs number)");
          console.log("- API 응답에 해당 userId가 없음");
          console.log("- API 응답 구조가 예상과 다름");
        }
      } else {
        console.log("API 응답이 배열이 아님:", response.data);
      }
    } catch (error) {
      console.error("설문 상태 조회 실패", error);
    }
  }, [teamId, userId, isFocused]);

  const setSurveyCompleted = useCallback((completed: boolean) => {
    console.log("설문 완료 상태 강제 설정:", completed);
    setIsSurveyCompleted(completed);
  }, []);

  return { isSurveyCompleted, checkSurveyStatus, setSurveyCompleted };
};
