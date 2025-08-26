import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type AddTeamCardProps = {
  onPress: () => void;
};

export const AddTeamCard: React.FC<AddTeamCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addCard} onPress={onPress}>
      <Text style={styles.addText}>+</Text>
      <Text style={styles.addSubText}>새 팀</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addCard: {
    width: "60%",
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  addText: {
    fontSize: 32,
    color: "#aaa",
    marginBottom: 8,
  },
  addSubText: {
    fontSize: 16,
    color: "#aaa",
    fontWeight: "500",
  },
});
