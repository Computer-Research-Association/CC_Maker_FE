import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FontFamily } from "../styles/GlobalStyles";

type SuccessModalProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function SuccessModal({ visible, message, onClose }: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>성공!</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 15,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    marginBottom: 25,
    color: "#666",
    textAlign: "center" as const,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#FF9898",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center" as const,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
};
