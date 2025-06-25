import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {  // navigation을 받아옵니다
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 로그인 처리 기존 코드
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        placeholder="이메일"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <Button title="로그인" onPress={handleLogin} />

      {/* 회원가입 버튼 추가 */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입 하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  signupText: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
