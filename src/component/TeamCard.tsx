import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

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
      <Text style={styles.roleText}>{team.role === "LEADER" ? "👑 팀장" : "👥 팀원"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  teamCard: {
    width: "60%",
    height: 150,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    justifyContent: "space-between",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  roleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
