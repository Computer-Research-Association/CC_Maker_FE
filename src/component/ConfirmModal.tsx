import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
//확인 모달 공동 컴포넌트

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  onCancel,
  onConfirm,
  confirmText = "예",
  cancelText = "아니오",
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={ms.overlay}>
      <View style={ms.content}>
        <Text style={ms.title}>{title}</Text>
        <View style={ms.row}>
          <TouchableOpacity style={[ms.btn, ms.cancel]} onPress={onCancel}>
            <Text style={ms.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ms.btn, ms.confirm]} onPress={onConfirm}>
            <Text style={ms.confirmText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Ongeulip",
    marginBottom: 20,
    textAlign: "center",
  },
  row: { flexDirection: "row", gap: 15 },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  cancel: { backgroundColor: "#bbb" },
  cancelText: { color: "#fff", fontSize: 16, fontFamily: "Ongeulip" },
  confirm: { backgroundColor: "#FF9898" },
  confirmText: { color: "#fff", fontSize: 16, fontFamily: "Ongeulip" },
});
