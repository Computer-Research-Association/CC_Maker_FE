import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/MissionScreenStyles";

type WaitingStateProps = {
  type: "matching" | "minScore";
};

export const WaitingState: React.FC<WaitingStateProps> = ({ type }) => {
  const getContent = () => {
    if (type === "matching") {
      return {
        title: "매칭을 먼저 진행해주세요.",
        subtitle: "미션을 시작하기 전에 매칭 과정을 완료해야 합니다.",
      };
    } else {
      return {
        title: "최소학점을 설정해주세요",
        subtitle: "미션을 시작하기 전에 최소학점을 설정해야 합니다.",
      };
    }
  };

  const { title, subtitle } = getContent();

  return (
    <View style={styles.waitingContainer}>
      <View style={styles.matchingWaitContainer}>
        <View style={styles.waitingIconContainer}>
          <Image
            source={require("../../assets/free-icon-hearts-18745836.png")}
            style={styles.waitingIcon}
          />
        </View>
        <Text style={styles.waitingTitleText}>{title}</Text>
        <Text style={styles.waitingSubText}>{subtitle}</Text>
      </View>
    </View>
  );
};
