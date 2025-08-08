import React, { useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

type NeonProgressBarProps = {
  progress: number; // 0~100
};

export default function NeonProgressBar({ progress }: NeonProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const waveShift = useRef(new Animated.Value(0)).current;

  // progress에 따라 바 길이 애니메이션
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 찰랑이는 애니메이션
  useEffect(() => {
    Animated.loop(
      Animated.timing(waveShift, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // width 값 애니메이션
  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // 상하 찰랑임 (translateY)
  const waveTranslateY = waveShift.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 4],
  });

  // 사인파 (세로로 찰랑거리는 모양)
  const waveHeight = 24;
  const wavePath = useMemo(() => {
    const A = 8; // amplitude
    const f = 0.25; // frequency
    const res = 1;
    const points: string[] = [];

    for (let y = 0; y <= waveHeight; y += res) {
      const x = A * Math.sin(f * y);
      points.push(`${x},${y}`);
    }

    return `M0,0 ${points.join(" ")} L0,${waveHeight} Z`;
  }, []);

  return (
    <View style={styles.glassContainer}>
      {/* 유리효과 */}
      <View style={styles.glassOverlay} />

      {/* 네온바 */}
      <Animated.View style={[styles.glowWrapper, { width: widthInterpolated }]}>
        <LinearGradient
          colors={["#a6b1ff", "#7a52ff", "#6c00ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bar}
        />

        {/* 출렁이는 끝부분 */}
        <Animated.View
          style={[
            styles.waveContainer,
            { transform: [{ translateY: waveTranslateY }] },
          ]}
        >
          <Svg width={20} height={waveHeight}>
            <Path d={wavePath} fill="#a6b1ff" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    height: 24,
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    position: "relative",
    shadowColor: "#a58fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  glowWrapper: {
    height: "100%",
    borderRadius: 50,
    flexDirection: "row",
    position: "relative",
  },
  bar: {
    height: "100%",
    borderRadius: 50,
    flex: 1,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    zIndex: 1,
  },
  waveContainer: {
    width: 20,
    height: 24,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
  },
});
