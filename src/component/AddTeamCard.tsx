import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/MainHomeScreenStyles";

type AddTeamCardProps = {
  onPress: () => void;
};

export const AddTeamCard: React.FC<AddTeamCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addCard} onPress={onPress}>
      <Text style={styles.addText}>+</Text>
      {/* <Text style={styles.addSubText}>새 팀</Text> */}
    </TouchableOpacity>
  );
};
