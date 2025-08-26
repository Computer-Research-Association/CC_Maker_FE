import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/HomeScreenStyles";

type MatchingWaitViewProps = {
  title: string;
  subtitle: string;
};

export const MatchingWaitView: React.FC<MatchingWaitViewProps> = ({ 
  title, 
  subtitle 
}) => {
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
