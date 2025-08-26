import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

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
  congratsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6b6b',
  },
  congratsMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
});
