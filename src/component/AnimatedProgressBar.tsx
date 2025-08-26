import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

type ProgressBarProps = {
  current: number;
  max: number;
  label?: string;
  barHeight?: number;
  gradient?: [string, string]; // 수정: 그라데이션 색상 타입을 튜플로 변경
  textColor?: string;  // 추가: 점수/퍼센트 글씨색
  percentColor?: string; // 추가: 퍼센트만 별도 색
  isTopTeam?: boolean; // 추가: 1등 그룹 여부
  hideBorder?: boolean; // 추가: 테두리 숨김 여부
  showInnerShadow?: boolean; // 추가: 테두리 안쪽에 인너 섀도우 표시
  containerBackgroundColor?: string; // 추가: 남은 부분(컨테이너 배경) 색상 오버라이드
};

export default function AnimatedProgressBar({
  current,
  max,
  label,
  barHeight = 20,
  gradient = ["#FFD1E1", "#FFB6D1"], // 기본 분홍 그라데이션
  textColor = "#888",
  percentColor = "#ff5a5a",
  isTopTeam = false, // 기본값 false
  hideBorder = false,
  showInnerShadow = true,
  containerBackgroundColor,
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

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  // 1등 그룹과 다른 그룹의 스타일 분기
  const getBarContainerStyle = () => {
    if (isTopTeam) {
      return {
        backgroundColor: "#fff", // 1등: 흰색 배경
        borderColor: "#FFE2E2", // 1등: 얇은 분홍 테두리
      };
    } else {
      return {
        backgroundColor: "#f3f4f6", // 다른 그룹: 옅은 회색 배경 (남은 부분)
        // borderColor: "#e5e7eb", // 다른 그룹: 옅은 회색 테두리
      };
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.barContainer,
          {
            height: barHeight,
            borderRadius: barHeight / 2,
            borderWidth: hideBorder ? 0 : 1,
            ...getBarContainerStyle(),
          },
          containerBackgroundColor
            ? { backgroundColor: containerBackgroundColor }
            : null,
        ]}
        onLayout={handleLayout}
      >
        {/* 그라데이션 바 */}
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth,
              borderRadius: barHeight / 2,
              overflow: 'hidden',
            },
          ]}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: barHeight / 2 }}
          />
        </Animated.View>

        {/* 인너 섀도우 (상/하단) */}
        {showInnerShadow && (
          <LinearGradient
            colors={["rgba(0,0,0,0.06)", "rgba(0,0,0,0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
            style={[styles.innerShadowTop, { borderRadius: barHeight / 2 }]}
          />
        )}
      </View>
      {/* 바 오른쪽에 점수/퍼센트 라벨 */}
      <View style={styles.labelRow}>
        <Text style={[styles.scoreText, { color: textColor }]}>{current}</Text>
        <Text style={[styles.slashText, { color: textColor }]}> / </Text>
        <Text style={[styles.maxText, { color: textColor }]}>{max}</Text>
        <Text style={[styles.percentText, { color: percentColor }]}>  ({Math.round(progress * 100)}%)</Text>
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
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 999,
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    // 테두리 없음
  },
  innerShadowTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3, // 더 얇게
    zIndex: 2,
  },
  // 하단 섀도우는 사용하지 않음
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 15,
    fontFamily: "Ongeulip",
  },
  slashText: {
    fontSize: 15,
  },
  maxText: {
    fontSize: 15,
    fontFamily: "Ongeulip",
  },
  percentText: {
    fontSize: 15,
    fontFamily: "Ongeulip",
    marginLeft: 2,
  },
});
