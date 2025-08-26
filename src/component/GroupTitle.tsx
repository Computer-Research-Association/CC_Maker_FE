import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type GroupTitleProps = {
  myName: string;
  myPartner: string | null;
  teamName: string | null;
};

export const GroupTitle: React.FC<GroupTitleProps> = ({ 
  myName, 
  myPartner, 
  teamName 
}) => {
  return (
    <View style={styles.groupTitleContainer}>
      <Image
        source={require("../../assets/free-icon-crown-6941697.png")}
        style={styles.crownIcon}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.myNameText}>{myName}</Text>
        <Image
          source={require("../../assets/free-icon-hearts-18745836.png")}
          style={styles.heartIcon}
        />
        <Text style={styles.myNameText}>
          {myPartner || teamName || "테스트"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupTitleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  crownIcon: {
    width: 44,
    height: 44,
    marginBottom: 2,
    marginLeft: 4,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  myNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  heartIcon: {
    width: 18,
    height: 18,
    marginHorizontal: 4,
  },
});
