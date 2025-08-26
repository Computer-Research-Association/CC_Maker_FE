import React from "react";
import { View, StyleSheet } from "react-native";
import { MbtiSelectionButton } from "./MbtiSelectionButton";

type MbtiType = {
  EI: string;
  SN: string;
  TF: string;
  JP: string;
};

type MbtiSelectionGroupProps = {
  mbti: MbtiType;
  mbtiOptions: Array<{ key: keyof MbtiType; options: string[] }>;
  onSelect: (key: keyof MbtiType, value: string) => void;
};

export const MbtiSelectionGroup: React.FC<MbtiSelectionGroupProps> = ({
  mbti,
  mbtiOptions,
  onSelect,
}) => {
  return (
    <View style={styles.horizontalGroup}>
      {mbtiOptions.map(({ key, options }) => (
        <View style={styles.verticalPair} key={key}>
          {options.map((option) => (
            <MbtiSelectionButton
              key={option}
              option={option}
              isSelected={mbti[key] === option}
              onPress={() => onSelect(key, option)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    justifyContent: "center",
  },
  verticalPair: {
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
    marginHorizontal: 6,
  },
});
