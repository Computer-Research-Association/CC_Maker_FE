import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const BOX_SIZE = 120;
const BOX_MARGIN = 6;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2); // 총 박스 영역 너비

export default function MissionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>1학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={`1-credit-${i}`}
              style={styles.box}
              // style={[styles.box, i === 0 && styles.selectedBox]}
            />
          ))}
        </View>
      </View>

      {/* 3학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>3학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={`3-credit-${i}`} style={styles.box} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>5학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={`1-credit-${i}`}
              style={styles.box}
              // style={[styles.box, i === 0 && styles.selectedBox]}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>10학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={`1-credit-${i}`}
              style={styles.box}
              // style={[styles.box, i === 0 && styles.selectedBox]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingVertical: 20,
    alignItems: "center", // 전체 스크롤뷰에서 가운데 정렬
  },
  section: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    backgroundColor: "#FFC0C0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: "bold",
    marginBottom: 12,
  },
  grid: {
    width: GRID_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
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
  selectedBox: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },
});
