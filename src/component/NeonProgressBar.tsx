import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  progress: number; // 0 ~ 100
};

export default function NeonProgressBar({ progress }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const tipShake = useRef(new Animated.Value(0)).current;

  // 진행도 애니메이션
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 찰랑거림 애니메이션 (무한 반복)
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tipShake, {
          toValue: 4,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(tipShake, {
          toValue: -4,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();

    return () => loop.stop(); // cleanup
  }, []);

  // width: progress에 따라 변화
  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const shouldShowTip = progress < 100;

  return (
    <View style={styles.glassWrapper}>
      {/* 배경 오버레이 */}
      <View style={styles.fogOverlay} />

      {/* 찰랑거리는 바 */}
      <Animated.View
        style={[styles.progressWrapper, { width: widthInterpolated }]}
      >
        <LinearGradient
          colors={["#a6b1ff", "#7a52ff", "#6c00ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* 끝부분 구슬 */}
      {shouldShowTip && (
        <Animated.View
          style={[
            styles.tip,
            {
              left: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              transform: [{ translateX: tipShake }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  glassWrapper: {
    width: "100%",
    height: 26,
    borderRadius: 50,
    backgroundColor: "#1b1b1b",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    position: "relative",
  },
  progressWrapper: {
    height: "100%",
    borderRadius: 50,
    shadowColor: "#a58fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  gradient: {
    height: "100%",
    borderRadius: 50,
  },
  fogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.05)",
    zIndex: 1,
  },
  tip: {
    position: "absolute",
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#a58fff",
    shadowColor: "#a58fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    zIndex: 3,
  },
});
