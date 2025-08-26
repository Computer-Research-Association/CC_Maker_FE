import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/MissionScreenStyles";

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
