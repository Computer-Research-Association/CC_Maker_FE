import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedProgressBar from "../component/AnimatedProgressBar";
import { useMissionScreen } from "../hooks/useMissionScreen";
import { MissionGrid } from "../component/MissionGrid";
import { MissionDetailModal } from "../component/MissionDetailModal";
import { MissionRefreshConfirmModal } from "../component/MissionRefreshConfirmModal";
import { CongratsModal } from "../component/CongratsModal";
import { WaitingState } from "../component/WaitingState";
import styles from "../styles/MissionScreenStyles";

export default function MissionScreen() {
  const {
    state: {
      missions,
      selectedBoxIndex,
      modalVisible,
      confirmModalVisible,
      scoreboard,
      showCongratsModal,
    },
    computed: { needsMatching, needsMinScore },
    actions: {
      handleBoxPress,
      handleComplete,
      confirmRefresh,
      closeModal,
      closeCongratsModal,
      setConfirmModalVisible,
    },
  } = useMissionScreen();

  if (needsMatching) return <WaitingState type="matching" />;
  if (needsMinScore) return <WaitingState type="minScore" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
                     <View style={styles.gridContainer}>
             {Array.from(new Set(missions.map(m => m.score))).sort((a, b) => a - b).map((credit) => (
               <MissionGrid
                 key={credit}
                 score={credit}
                 missions={missions}
                 onBoxPress={handleBoxPress}
                 getMissionIndex={(m) =>
                   missions.findIndex((mm) => mm.subGroupMissionId === m.subGroupMissionId)
                 }
               />
             ))}
           </View>
        </ScrollView>

        <MissionDetailModal
          visible={modalVisible}
          mission={selectedBoxIndex !== null ? missions[selectedBoxIndex] : null}
          onClose={closeModal}
          onComplete={handleComplete}
          onRefresh={confirmRefresh}
          onShowRefreshConfirm={() => setConfirmModalVisible(true)}
        />

        <MissionRefreshConfirmModal
          visible={confirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          onConfirm={confirmRefresh}
        />

        <CongratsModal visible={showCongratsModal} onClose={closeCongratsModal} />
      </View>
    </SafeAreaView>
  );
}
