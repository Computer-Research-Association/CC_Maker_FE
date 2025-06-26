import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {  // navigation을 받아옵니다
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const handleLogin = async () => {
    // 로그인 처리 기존 코드
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="sample@gmail.com"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="영문,숫자,특수문자 포함 8자 이상"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.roundButton} onPress={handleLogin}>
          <Text style={styles.roundButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 버튼 추가 */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} >
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding:50,flex:1, backgroundColor:'#ffe6cc',justifyContent: 'center'},
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    color: 'white', // 입력된 텍스트 색상
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius:15,
  },
  signupText: {
    marginTop: 15,
    color: 'black',
    textAlign: 'right',
    opacity :0.7,
  },
  roundButton: {
  backgroundColor: '#f4a261',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 15,          // ← 요게 버튼을 둥글게 만듭니다!
  alignItems: 'center',
  marginBottom: 10,
},
roundButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});
