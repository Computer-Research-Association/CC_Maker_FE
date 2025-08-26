import React from "react";
import { View, Text, Modal } from "react-native";
import SubmitButton from "./SubmitButton";
import styles from "../styles/MissionScreenStyles";

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
