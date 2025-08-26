import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/MainHomeScreenStyles";

type Role = "MEMBER" | "LEADER";

interface Team {
  id: number;
  teamName: string;
  role: Role;
}

type TeamCardProps = {
  team: Team;
  onPress: (team: Team) => void;
};

export const TeamCard: React.FC<TeamCardProps> = ({ team, onPress }) => {
  const handlePress = () => {
    onPress(team);
  };

  return (
    <TouchableOpacity style={styles.teamCard} onPress={handlePress}>
      <Text style={styles.teamName}>{team.teamName}</Text>
      {/* <Text style={styles.roleText}>{team.role === "LEADER" ? "👑 팀장" : "👥 팀원"}</Text> */}
    </TouchableOpacity>
  );
};
