import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from "react-native";
import SubmitButton from "./SubmitButton";

type TeamActionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateTeam: () => void;
  onJoinTeam: () => void;
};

const windowWidth = Dimensions.get("window").width;

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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: windowWidth * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    color: "#111",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
  },
  modalButtonText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});
