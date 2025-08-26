import React from 'react';
import { View, Text } from 'react-native';
import LikertScale from '../function/LikertScale';
import styles from '../styles/QuestionScreenStyles';

type QuestionContentProps = {
  index: number;
  question: string;
  onSelect: (value: number | null) => void;
};

export const QuestionContent = ({ index, question, onSelect }: QuestionContentProps) => {
  return (
    <View style={styles.contentArea}>
      <Text style={styles.title}>질문 {index + 1}</Text>
      <Text style={styles.questionText}>{question}</Text>
      <LikertScale question={question} onSelect={onSelect} />
    </View>
  );
};
