import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Mission = {
  subGroupMissionId: number;
  missionTemplateId: number;
  title: string;
  description: string;
  score: number;
  completed: boolean;
};

type MissionGridProps = {
  score: number;
  missions: Mission[];
  onBoxPress: (index: number) => void;
  getMissionIndex: (mission: Mission) => number;
};

const BOX_SIZE = 108;
const BOX_MARGIN = 4;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

export const MissionGrid: React.FC<MissionGridProps> = ({
  score,
  missions,
  onBoxPress,
  getMissionIndex,
}) => {
  const missionsByScore = missions.filter((m) => m.score === score);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{score}학점</Text>
      <View style={styles.grid}>
        {missionsByScore.map((mission) => (
          <TouchableOpacity
            key={`${score}-credit-${mission.subGroupMissionId}`}
            style={[styles.box, mission.completed && styles.completedBox]}
            onPress={() => !mission.completed && onBoxPress(getMissionIndex(mission))}
            disabled={mission.completed}
          >
            <Text style={styles.missionBoxText}>
              {mission.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: GRID_WIDTH + 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    backgroundColor: "#FF9494",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    fontFamily: "Ongeulip",
    fontSize: 14,
    color: "#fff",
  },
  grid: {
    width: GRID_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ddd",
    margin: BOX_MARGIN,
    justifyContent: "center",
    alignItems: "center",
  },
  completedBox: {
    backgroundColor: "#d3d3d3",
  },
  missionBoxText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "Ongeulip",
    fontSize: 14,
    color: "#333",
  },
});
