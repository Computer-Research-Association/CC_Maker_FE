import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { TiltCard } from "./TiltCard";
import SubmitButton from "./SubmitButton";

type Mission = {
  subGroupMissionId: number;
  missionTemplateId: number;
  title: string;
  description: string;
  score: number;
  completed: boolean;
};

type MissionDetailModalProps = {
  visible: boolean;
  mission: Mission | null;
  onClose: () => void;
  onComplete: () => void;
  onRefresh: () => void;
  onShowRefreshConfirm: () => void;
};

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
  visible,
  mission,
  onClose,
  onComplete,
  onRefresh,
  onShowRefreshConfirm,
}) => {
  if (!mission) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.missionTitle}>
              {mission.score}학점
            </Text>

            <TiltCard disabled={false}>
              <LinearGradient
                colors={["#ffe5ec", "#ffd6e0", "#fff0f5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.missionBox}
              >
                <View style={styles.glassOverlay} />
                <View style={styles.missionContentWrapper}>
                  <Text style={styles.missionContent}>
                    {mission.description}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={onShowRefreshConfirm}
                  disabled={mission.completed}
                >
                  <Text style={styles.refreshText}>↻ 새로고침</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TiltCard>

            <View style={styles.modalButtons}>
              <SubmitButton
                title="취소"
                onPress={onClose}
                buttonColor="#bbb"
                width={120}
                height={50}
                shadowColor="#aaa"
                style={{ marginLeft: 10 }}
              />

              <SubmitButton
                title="미션완료"
                onPress={onComplete}
                width={120}
                height={50}
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
              />
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
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
  missionBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#FF8CC6",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 12,
    width: "90%",
    minHeight: 280,
    minWidth: 200,
    overflow: "visible",
    position: "relative",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff6",
    shadowColor: "#ff9ce5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    zIndex: -1,
  },
  missionContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  missionContent: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontFamily: "Ongeulip",
    lineHeight: 22,
  },
  refreshButton: {
    position: "absolute",
    bottom: 10,
    right: 12,
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    minHeight: 28,
    borderRadius: 10,
    zIndex: 1,
  },
  refreshText: {
    fontFamily: "Ongeulip",
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
