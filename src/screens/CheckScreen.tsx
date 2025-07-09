import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Member = {
  id: string;
  name: string;
  checked: boolean;
};

const members: Member[] = Array.from({ length: 30 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `팀원`,
  checked: true,
}));

export default function CheckScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.role}>팀장</Text>
      <Text style={styles.count}>00명</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.checkbox}>{item.checked ? "✅" : "⬜️"}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>매칭시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fafafa",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  role: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  count: {
    textAlign: "left",
    marginBottom: 12,
    fontSize: 14,
  },
  listContainer: {
    // backgroundColor: "#fff0ff",
    borderRadius: 10,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: "#d1b3ff",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    fontSize: 18,
    color: "purple",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff85d0",
    paddingHorizontal: 100,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
