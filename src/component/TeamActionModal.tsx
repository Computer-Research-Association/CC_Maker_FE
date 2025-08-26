import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import SubmitButton from "./SubmitButton";
import styles from "../styles/MainHomeScreenStyles";

type TeamActionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateTeam: () => void;
  onJoinTeam: () => void;
};

export const TeamActionModal: React.FC<TeamActionModalProps> = ({
  visible,
  onClose,
  onCreateTeam,
  onJoinTeam,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>팀을 선택해주세요</Text>

          <SubmitButton
            title="팀생성하기"
            buttonColor="#FF9898"
            shadowColor="#E08B8B"
            onPress={onCreateTeam}
          >
            <Text style={styles.modalButtonText}>팀 생성하기</Text>
          </SubmitButton>

          <SubmitButton
            title="참여하기"
            buttonColor="#ffd1d1"
            shadowColor="#ffe3e1"
            onPress={onJoinTeam}
            style={{ marginTop: 7 }}
          >
            <Text style={styles.modalButtonText}>팀 참여하기</Text>
          </SubmitButton>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
