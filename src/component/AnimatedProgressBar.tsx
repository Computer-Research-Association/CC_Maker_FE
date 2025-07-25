import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";

type ProgressBarProps = {
  current: number;
  max: number;
  label?: string;
  barHeight?: number;
};

export default function AnimatedProgressBar({
  current,
  max,
  label,
  barHeight = 20,
}: ProgressBarProps) {
  const progress = max === 0 ? 0 : current / max;
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
    if (progress < 0.3) return "#FFF5E4";
    if (progress < 0.5) return "#FFE3E1";
    if (progress < 0.8) return "#FFD1D1";
    return "#FF9494";
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const formattedLabel = `${current} / ${max} (${Math.round(progress * 100)}%)`;

  return (
    <View style={styles.container}>
      {/* ✅ 퍼센트 바 영역 */}
      <View
        style={[
          styles.barContainer,
          {
            height: barHeight - 10,
            borderRadius: barHeight / 2,
          },
        ]}
        onLayout={handleLayout}
      >
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth,
              backgroundColor: getBarColor(),
              borderRadius: barHeight / 2,
            },
          ]}
        />

        {/* ✅ 바 안 텍스트 */}
        <View style={styles.labelOverlay}>
          <Text style={styles.labelText}>{formattedLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 1,
  },
  barContainer: {
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd", // 필요 시 "#000" 등으로 변경
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  labelOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 10,
    fontWeight: "300",
    color: "#000", // 필요하면 contrast 고려해서 white로 바꿔도 됨
  },
});
