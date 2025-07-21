import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from "react-native";

type ProgressBarProps = {
  current: number;
  max: number;
  label?: string;
};

export default function AnimatedProgressBar({ current, max, label }: ProgressBarProps) {
  const progress = current / max; // 100% 넘는 값 허용
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (barWidth > 0) {
      Animated.timing(animatedWidth, {
        toValue: barWidth * progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, barWidth]);

  const getBarColor = () => {
    if (progress < 0.5) return "#f44336"; // 빨강
    if (progress < 0.8) return "#ffeb3b"; // 노랑
    return "#4caf50"; // 초록
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.barBackground} onLayout={handleLayout}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth, // px 단위로 계산된 값
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>
      <Text style={styles.text}>
        {current} / {max} ({Math.round(progress * 100)}%)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  text: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
});
