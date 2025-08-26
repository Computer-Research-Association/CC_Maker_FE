import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Clipboard from "expo-clipboard";
import api from '../api/apiClient';

export const useInviteCode = (teamId: string) => {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const createInviteCode = useCallback(async () => {
    try {
      const response = await api.post("/api/invitecode/create", { teamId });
      const code = response.data.inviteCode || response.data.code;
      setInviteCode(code);
      setModalVisible(true);
    } catch (error) {
      console.error("초대 코드 생성 실패:", error);
      Alert.alert("오류", "초대 코드 생성 중 문제가 발생했습니다.");
    }
  }, [teamId]);

  const copyToClipboard = useCallback(async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("복사 완료", "초대 코드가 클립보드에 복사되었습니다.");
    }
  }, [inviteCode]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    inviteCode,
    modalVisible,
    createInviteCode,
    copyToClipboard,
    closeModal
  };
};
