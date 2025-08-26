import React from "react";
import { View, Text, Modal } from "react-native";
import SubmitButton from "./SubmitButton";
import styles from "../styles/MissionScreenStyles";

type CongratsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const CongratsModal: React.FC<CongratsModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { alignItems: "center" }]}>
          <Text style={styles.congratsTitle}>
            축하합니다! 
          </Text>
          <Text style={styles.congratsMessage}>
            최소학점을 달성했습니다!
          </Text>
          <SubmitButton
            title="확인"
            onPress={onClose}
            buttonColor="#FF9898"
            shadowColor="#E08B8B"
            width={120}
            height={50}
            style={{ marginTop: 5 }}
          />
        </View>
      </View>
    </Modal>
  );
};
