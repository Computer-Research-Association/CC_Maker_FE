import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import api from '../api/apiClient';

export const useMinCredit = (teamId: string) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [minScore, setMinScore] = useState("");

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setMinScore(""); // 모달 닫을 때 입력값 초기화
  }, []);

  const saveMinScore = useCallback(async () => {
    const parsedScore = parseInt(minScore, 10);
    if (isNaN(parsedScore) || parsedScore < 0) {
      Alert.alert("오류", "유효한 최소 학점을 입력해주세요.");
      return;
    }
    
    try {
      await api.post(`/api/team/${teamId}/min-credit`, {
        minScore: parsedScore,
      });
      Alert.alert("성공", "최소 학점이 저장되었습니다.");
      closeModal();
    } catch (error) {
      console.error("최소 학점 저장 실패:", error);
      Alert.alert("오류", "최소 학점 저장에 실패했습니다.");
    }
  }, [minScore, teamId, closeModal]);

  return {
    modalVisible,
    minScore,
    setMinScore,
    openModal,
    closeModal,
    saveMinScore
  };
};
