// components/MissionBox.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const dummyMissions = ["미션1", "미션2", "미션3", "미션4"];
const BOX_SIZE = 120;
const BOX_MARGIN = 6;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2); // 총 박스 영역 너비

export default function MissionBox() {
  const [content, setContent] = useState("미션1");

  const refreshContent = () => {
    // 랜덤으로 내용 바꾸기
    const newContent =
      dummyMissions[Math.floor(Math.random() * dummyMissions.length)];
    setContent(newContent);
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.refresh} onPress={refreshContent}>
        <Text style={styles.refreshText}>🔄</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ddd",
    margin: BOX_MARGIN,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  refresh: {
    position: "absolute",
    top: 4,
    right: 6,
    zIndex: 10,
  },
  refreshText: {
    fontSize: 16,
    fontFamily: "Ongeulip",
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Ongeulip",
    color: "#333",
  },
});
