import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from '../../styles/SignupScreen.styles';

type PasswordInputsProps = {
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
  onChangePassword: (text: string) => void;
  onChangeConfirmPassword: (text: string) => void;
};

export const PasswordInputs = ({
  password,
  passwordError,
  confirmPassword,
  confirmPasswordError,
  onChangePassword,
  onChangeConfirmPassword,
}: PasswordInputsProps) => {
  return (
    <>
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        placeholder="영문+숫자+특수문자 포함, 8자 이상"
        onChangeText={onChangePassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      {passwordError ? (
        <Text style={{ color: 'red', fontSize: 12, marginTop: -15, marginBottom: 10 }}>
          {passwordError}
        </Text>
      ) : null}

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        placeholder="비밀번호 재입력"
        onChangeText={onChangeConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        style={styles.input}
      />
      {confirmPasswordError ? (
        <Text style={{ color: 'red', fontSize: 12, marginTop: -15, marginBottom: 10 }}>
          {confirmPasswordError}
        </Text>
      ) : null}
    </>
  );
};
