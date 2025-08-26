import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "./SubmitButton";

type MatchingButtonProps = {
  canStartMatching: boolean;
  memberCount: number;
  onPress: () => void;
};

export const MatchingButton: React.FC<MatchingButtonProps> = ({
  canStartMatching,
  memberCount,
  onPress,
}) => {
  if (canStartMatching) {
    return (
      <SubmitButton
        title="매칭시작하기"
        onPress={onPress}
        style={{ marginBottom: 40 }}
        buttonColor="#FF9898"
        shadowColor="#E08B8B"
        width={360}
      />
    );
  }

  return (
    <View style={styles.infoContainer}>
      <Ionicons name="information-circle-outline" size={24} color="#666" />
      <Text style={styles.infoTitle}>
        매칭을 시작하려면 최소 2명이 필요합니다
      </Text>
      <Text style={styles.infoSubtitle}>
        현재 {memberCount}명이 있습니다
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    alignItems: "center",
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  infoTitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  infoSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
