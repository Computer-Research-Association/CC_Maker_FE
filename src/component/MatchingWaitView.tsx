import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  matchingWaitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchingIconContainer: {
    marginBottom: 20,
  },
  matchingIcon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  matchingTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  matchingSubText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
});
