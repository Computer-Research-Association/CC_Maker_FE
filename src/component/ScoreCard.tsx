import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AnimatedProgressBar from "./AnimatedProgressBar";
import { SubGroupScore } from "../utils/scoreUtils";

type ScoreCardProps = {
  group: SubGroupScore;
  minScore: number;
  isTopTeam?: boolean;
  isMyTeam?: boolean;
  teamName?: string | null;
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  group, 
  minScore, 
  isTopTeam = false, 
  isMyTeam = false, 
  teamName = null 
}) => {
  const getCardStyle = () => {
    if (isTopTeam) return styles.topCardBox;
    if (isMyTeam) return [styles.otherCardBox, styles.blueCardBox];
    return styles.otherCardBox;
  };

  const getTextStyle = () => {
    if (isTopTeam) return styles.topNameText;
    if (isMyTeam) return styles.blueNameText;
    return styles.otherNameText;
  };

  const getProgressBarProps = (): {
    gradient: [string, string];
    textColor: string;
    percentColor: string;
    isTopTeam?: boolean;
    hideBorder?: boolean;
    containerBackgroundColor?: string;
  } => {
    if (isTopTeam) {
      return {
        gradient: ["#ffb6d1", "#ffd1e1"],
        textColor: "#888",
        percentColor: "#ff5a5a",
        isTopTeam: true,
      };
    }
    
    if (isMyTeam) {
      return {
        gradient: ["#b6d1ff", "#d1e1ff"],
        textColor: "#2196f3",
        percentColor: "#2196f3",
        hideBorder: true,
        containerBackgroundColor: "#DBEAFE",
      };
    }
    
    return {
      gradient: ["#D2D9E1", "#DDDFE3"],
      textColor: "#888",
      percentColor: "#888",
      hideBorder: true,
    };
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.nameContainer}>
        <Text style={getTextStyle()}>
          {group.members?.[0] ?? ""}
        </Text>
        <Image
          source={require("../../assets/free-icon-hearts-18745836.png")}
          style={[
            styles.heartIcon,
            isTopTeam ? styles.topHeartIcon : styles.otherHeartIcon
          ]}
        />
        <Text style={getTextStyle()}>
          {group.members && group.members.length > 1
            ? group.members.slice(1).join(" & ")
            : teamName || "테스트"}
        </Text>
      </View>
      <AnimatedProgressBar
        current={group.score}
        max={minScore}
        barHeight={isTopTeam ? 28 : 24}
        {...getProgressBarProps()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topCardBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  otherCardBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  blueCardBox: {
    borderWidth: 2,
    borderColor: "#2196f3",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  topNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5a5a",
  },
  blueNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196f3",
  },
  otherNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  heartIcon: {
    marginHorizontal: 2,
  },
  topHeartIcon: {
    width: 18,
    height: 18,
  },
  otherHeartIcon: {
    width: 16,
    height: 16,
  },
});
