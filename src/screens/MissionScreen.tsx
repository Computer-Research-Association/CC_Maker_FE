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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 12, alignItems: "center" }}>
          <View style={{ width: "100%", paddingHorizontal: 8, marginBottom: 12 }}>
            <AnimatedProgressBar
              current={scoreboard?.mySubGroup?.score ?? 0}
              max={scoreboard?.minScore ?? 1}
              barHeight={16}
              gradient={["#ffb6d1", "#ffd1e1"]}
              textColor="#444"
              percentColor="#ff5a5a"
            />
          </View>

          <View style={{ width: "100%", paddingHorizontal: 8 }}>
            {[1, 3, 5].map((credit) => (
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
