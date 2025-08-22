import React from 'react';
import { View, StyleSheet } from 'react-native';
import CherryBlossom from './CherryBlossom';

const CherryBlossomContainer: React.FC = () => {
  // 벚꽃잎 개수와 다양한 설정
  const petals = [
    { delay: 0, duration: 8000, size: 15, color: '#FFB6C1' },
    { delay: 1000, duration: 9000, size: 20, color: '#FFC0CB' },
    { delay: 2000, duration: 7500, size: 12, color: '#FFE4E1' },
    { delay: 3000, duration: 8500, size: 18, color: '#FFB6C1' },
    { delay: 4000, duration: 7000, size: 16, color: '#FFC0CB' },
    { delay: 5000, duration: 9500, size: 14, color: '#FFE4E1' },
    { delay: 6000, duration: 8000, size: 19, color: '#FFB6C1' },
    { delay: 7000, duration: 9000, size: 13, color: '#FFC0CB' },
    { delay: 8000, duration: 7500, size: 17, color: '#FFE4E1' },
    { delay: 9000, duration: 8500, size: 15, color: '#FFB6C1' },
    { delay: 10000, duration: 7000, size: 20, color: '#FFC0CB' },
    { delay: 11000, duration: 9500, size: 12, color: '#FFE4E1' },
    { delay: 12000, duration: 8000, size: 18, color: '#FFB6C1' },
    { delay: 13000, duration: 9000, size: 16, color: '#FFC0CB' },
    { delay: 14000, duration: 7500, size: 14, color: '#FFE4E1' },
  ];

  return (
    <View style={styles.container}>
      {petals.map((petal, index) => (
        <CherryBlossom
          key={index}
          delay={petal.delay}
          duration={petal.duration}
          size={petal.size}
          color={petal.color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none', // 터치 이벤트를 통과시킴
  },
});

export default CherryBlossomContainer;

