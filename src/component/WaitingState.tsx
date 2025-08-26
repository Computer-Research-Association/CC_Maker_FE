import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.matchingWaitContainer}>
        <View style={styles.matchingIconContainer}>
          <Image
            source={require("../../assets/free-icon-hearts-18745836.png")}
            style={styles.matchingIcon}
          />
        </View>
        <Text style={styles.matchingTitleText}>{title}</Text>
        <Text style={styles.matchingSubText}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 0,
  },
  matchingWaitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffe3ed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#ffb6c1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  matchingIcon: {
    width: 60,
    height: 60,
    tintColor: "#ff6b6b",
  },
  matchingTitleText: {
    fontSize: 20,
    fontFamily: "Ongeulip",
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
  matchingSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Ongeulip",
  },
});
