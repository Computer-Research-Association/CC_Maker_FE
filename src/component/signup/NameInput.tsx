import React from 'react';
import { Text, TextInput } from 'react-native';
import styles from '../../styles/SignupScreen.styles';

type NameInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const NameInput = ({ value, onChangeText }: NameInputProps) => {
  return (
    <>
      <Text style={styles.label}>이름</Text>
      <TextInput
        placeholder="이름"
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
      />
    </>
  );
};
