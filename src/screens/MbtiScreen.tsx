import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MbtiScreen'>;
};
export default function MBTISelector({ navigation }: Props) {
  const [mbti, setMbti] = useState<{ [key: string]: string }>({
    EI: '',
    SN: '',
    TF: '',
    JP: '',
  });

  const handleSelect = (key: keyof typeof mbti, value: string) => {
    setMbti(prev => ({ ...prev, [key]: value }));
  };

  const getMBTI = () => {
    const mbtiString = mbti.EI + mbti.SN + mbti.TF + mbti.JP;
    if (mbtiString.length < 4) {
      Alert.alert('선택 부족', '4가지 모두 선택해주세요.');
      return;
    }
    Alert.alert('당신의 MBTI는', mbtiString);
  };

  // 버튼 애니메이션 (눌리는 효과)
  const yAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(yAnim, {
      toValue: 2,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(yAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MBTI 선택</Text>

      <View style={styles.horizontalGroup}>
        {[
          { key: 'EI', options: ['E', 'I'] },
          { key: 'SN', options: ['S', 'N'] },
          { key: 'TF', options: ['T', 'F'] },
          { key: 'JP', options: ['J', 'P'] },
        ].map(({ key, options }) => (
          <View style= {styles.verticalPair} key={key}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.button,
                  mbti[key as keyof typeof mbti] === option && styles.selected,
                ]}
                onPress={() => handleSelect(key as keyof typeof mbti, option)}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* 그림자 감싸는 버튼 */}
      <View style={styles.shadowWrapper}>
        <View style={styles.shadowLayer} />
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={getMBTI}>
          <Animated.View
            style={[
              styles.submitButton,
              { transform: [{ translateY: yAnim }] },
            ]}
          >
            <Text style={styles.submitText}>MBTI 확인</Text>
          </Animated.View>
        </Pressable>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('QuestionScreen', { index: 0 })}
      >
        <Text style={styles.submitText}>질문 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  horizontalGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    justifyContent: 'center',
  },
  verticalPair: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal: 6,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selected: {
    backgroundColor: '#FF9898',
    borderColor: '#FF9898',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  // ✅ 얇고 감싸는 그림자
  shadowWrapper: {
    alignItems: 'center',
    marginTop: 40,
    height: BUTTON_HEIGHT + 8,
  },
  shadowLayer: {
    position: 'absolute',
    top: 2, // 아주 살짝 아래
    width: BUTTON_WIDTH , // 좌우 2px 여유
    height: BUTTON_HEIGHT +1.5, // 상하 2px 여유
    backgroundColor: '#B54D4D',
    borderRadius: 999,
    zIndex: 0,
  },

  submitButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: '#FF9898',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
  borderColor: '#B54D4D',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
