import React from 'react';
import { View } from 'react-native';
import SubmitButton from './SubmitButton';
import styles from '../styles/QuestionScreenStyles';

type QuestionNavigationProps = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export const QuestionNavigation = ({ 
  canGoPrevious, 
  canGoNext, 
  onPrevious, 
  onNext 
}: QuestionNavigationProps) => {
  return (
    <View style={styles.buttonRow}>
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        {canGoPrevious && (
          <SubmitButton
            title="이전"
            buttonColor="#bbb"
            shadowColor="#aaa"
            onPress={onPrevious}
            disabled={false}
            style={{ width: 150 }}
          />
        )}
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <SubmitButton
          title="다음"
          onPress={onNext}
          disabled={!canGoNext}
          buttonColor="#FF9898"
          shadowColor="#E08B8B"
          style={{ width: 150 }}
        />
      </View>
    </View>
  );
};
