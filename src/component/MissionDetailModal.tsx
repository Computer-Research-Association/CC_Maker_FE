import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { TiltCard } from "./TiltCard";
import SubmitButton from "./SubmitButton";
import styles from "../styles/MissionScreenStyles";

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
