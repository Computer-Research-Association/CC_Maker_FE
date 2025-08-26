import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles/SignupScreen.styles';

type BirthDateInputsProps = {
  year: string;
  month: string;
  day: string;
  error: string;
  onChangeYear: (text: string) => void;
  onChangeMonth: (text: string) => void;
  onChangeDay: (text: string) => void;
};

export const BirthDateInputs = ({ year, month, day, error, onChangeYear, onChangeMonth, onChangeDay }: BirthDateInputsProps) => {
  return (
    <>
      <Text style={styles.label}>생년월일</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <TextInput
          placeholder="년(YYYY)"
          value={year}
          onChangeText={onChangeYear}
          keyboardType="numeric"
          maxLength={4}
          style={[styles.input, { flex: 3, marginRight: 5 }]}
        />
        <TextInput
          placeholder="월(MM)"
          value={month}
          onChangeText={onChangeMonth}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, { flex: 2, marginHorizontal: 5 }]}
        />
        <TextInput
          placeholder="일(DD)"
          value={day}
          onChangeText={onChangeDay}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, { flex: 2, marginLeft: 5 }]}
        />
      </View>
      <View style={{ marginBottom: 10, marginVertical: -20 }}>
        <Text style={{ color: error ? 'red' : 'transparent', fontSize: 12 }}>
          {error || '올바른 생년월일을 입력하세요.'}
        </Text>
      </View>
    </>
  );
};
