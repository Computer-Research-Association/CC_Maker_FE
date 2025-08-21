import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CherryBlossomProps {
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
}

const CherryBlossom: React.FC<CherryBlossomProps> = ({
  delay = 0,
  duration = 8000,
  size = 20,
  color = '#FFB6C1'
}) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = () => {
      // 초기 위치 설정
      translateY.setValue(-50);
      translateX.setValue(Math.random() * screenWidth);
      rotate.setValue(0);
      opacity.setValue(1);

      // 애니메이션 시퀀스
      Animated.parallel([
        // 아래로 떨어지는 애니메이션
        Animated.timing(translateY, {
          toValue: screenHeight + 50,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        // 좌우로 흔들리는 애니메이션
        Animated.timing(translateX, {
          toValue: Math.random() * screenWidth + (Math.random() - 0.5) * 100,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        // 회전 애니메이션
        Animated.timing(rotate, {
          toValue: 1,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        // 투명도 애니메이션
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.3,
          delay: delay + duration * 0.7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 애니메이션 완료 후 다시 시작
        setTimeout(startAnimation, Math.random() * 3000);
      });
    };

    startAnimation();
  }, [delay, duration, translateY, translateX, rotate, opacity]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.petal,
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [
            { translateY },
            { translateX },
            { rotate: spin },
          ],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default CherryBlossom;
