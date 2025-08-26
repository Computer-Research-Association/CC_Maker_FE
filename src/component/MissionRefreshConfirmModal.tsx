import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

type MissionRefreshConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const MissionRefreshConfirmModal: React.FC<MissionRefreshConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.missionTitle}>
            정말 이 미션을 새로고침할까요?
          </Text>
          <View style={styles.modalButtons}>
            <SubmitButton
              title="아니오"
              onPress={onClose}
              buttonColor="#bbb"
              shadowColor="#aaa"
              width={120}
              height={50}
              style={{ marginTop: 5, marginLeft: 10 }}
            />
            <SubmitButton
              title="새로고침"
              onPress={onConfirm}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              width={120}
              height={50}
              style={{ marginTop: 5 }}
            />
          </View>
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
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 280,
    alignItems: "center",
  },
  missionTitle: {
    fontSize: 16,
    fontFamily: "Ongeulip",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
