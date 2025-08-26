import React from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "./SubmitButton";
import styles from "../styles/CheckScreenStyles";

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
