import React from "react";
import { View, Text, Image } from "react-native";
import AnimatedProgressBar from "./AnimatedProgressBar";
import { SubGroupScore } from "../utils/scoreUtils";
import styles from "../styles/HomeScreenStyles";

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
          style={styles.heartIcon}
        />
        {group.members && group.members.length > 1 ? (
          <View style={styles.heartPartnersContainer}>
            {group.members.slice(1).map((member, index) => (
              <React.Fragment key={index}>
                <Text style={getTextStyle()}>{member}</Text>
                {index < group.members.slice(1).length - 1 && (
                  <Image
                    source={require("../../assets/free-icon-hearts-18745836.png")}
                    style={styles.heartIcon}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <Text style={getTextStyle()}>
            {teamName || "테스트"}
          </Text>
        )}
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
