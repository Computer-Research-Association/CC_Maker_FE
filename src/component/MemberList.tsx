import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Member = {
  userId: number;
  userName: string;
  surveyCompleted: boolean;
};

type MemberListProps = {
  members: Member[];
};

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const renderMember = ({ item, index }: { item: Member; index: number }) => (
    <View key={item.userId}>
      {index !== 0 && <View style={styles.divider} />}
      <View style={styles.listItem}>
        <Text style={styles.name}>{item.userName}</Text>
        <Ionicons
          name={item.surveyCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={90}
          color={item.surveyCompleted ? "#50B889" : "#ccc"}
          style={styles.checkbox}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.role}>팀원 설문 상태</Text>
      <Text style={styles.count}>{members.length}명</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMember}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  role: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  count: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  checkbox: {
    marginLeft: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
});
