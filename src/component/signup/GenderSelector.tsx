import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import styles from '../../styles/SignupScreen.styles';

type GenderSelectorProps = {
  gender: 'male' | 'female';
  onChange: (value: 'male' | 'female') => void;
};

export const GenderSelector = ({ gender, onChange }: GenderSelectorProps) => {
  return (
    <>
      <Text style={styles.label}>성별</Text>
      <View style={styles.genderBox}>
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => onChange('male')}
            />
            <Text style={{ fontFamily: 'Ongeulip' }}>남성</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => onChange('female')}
            />
            <Text style={{ fontFamily: 'Ongeulip' }}>여성</Text>
          </View>
        </View>
      </View>
    </>
  );
};
