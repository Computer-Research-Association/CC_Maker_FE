import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type MbtiSelectionButtonProps = {
  option: string;
  isSelected: boolean;
  onPress: () => void;
};

export const MbtiSelectionButton: React.FC<MbtiSelectionButtonProps> = ({
  option,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        isSelected && styles.selectedText,
      ]}>
        {option}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#FF9898",
    borderColor: "#FF9898",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
});
