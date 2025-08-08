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
        {/* ✅ 유리 느낌 오버레이 */}
        <View style={styles.glassOverlay} />
        <View style={styles.shineOverlay} />

        {/* ✅ 진행도 채우기 */}
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth,
              backgroundColor: getBarColor(),
              borderRadius: barHeight / 2,

              // ✅ 네온 느낌 그림자 추가
              shadowColor: getBarColor(),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 10, // Android
            },
          ]}
        />

        {/* ✅ 바 중앙 라벨 */}
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
    borderColor: "#ddd",
    borderRadius: 999,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  barFillGlow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },

  labelOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: "300",
    color: "#000",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    zIndex: 2,
  },
  shineOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderBottomRightRadius: 999,
    borderBottomLeftRadius: 999,
    zIndex: 3,
  },
});
