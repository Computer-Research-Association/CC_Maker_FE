import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { questions } from './Question';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionScreen'>;

export default function QuestionScreen({ route, navigation }: Props) {
  const { index } = route.params;
  const current = questions[index];

  const goToNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      navigation.push('QuestionScreen', { index: nextIndex });
    } else {
      // 마지막 질문 끝났을 때 처리
      alert('모든 질문이 끝났습니다!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>질문 {index + 1}</Text>
      <Text style={styles.questionText}>{current.question}</Text>

      <TouchableOpacity style={styles.button} onPress={goToNext}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  questionText: { fontSize: 18, marginVertical: 20, textAlign: 'center' },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
