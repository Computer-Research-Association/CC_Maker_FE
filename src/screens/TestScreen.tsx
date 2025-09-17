// screens/NeonProgressTestScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import NeonProgressBar from "../component/VerticalWaveProgressBar"; // 경로는 네가 만든 위치에 따라 조정

export default function NeonProgressTestScreen() {
  const [progress, setProgress] = useState(0);

  const increase = () => setProgress((prev) => Math.min(prev + 10, 100));
  const reset = () => setProgress(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ 네온 프로그레스바 테스트 ⚡</Text>

      <NeonProgressBar progress={progress} />

      <View style={styles.buttons}>
        <Button title="Progress +10%" onPress={increase} />
        <Button title="Reset" onPress={reset} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // 네온 느낌 살리려면 어두운 배경
    padding: 24,
    justifyContent: "center",
    gap: 30,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Ongeulip",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
