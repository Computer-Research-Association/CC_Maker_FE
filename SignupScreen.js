import React, { useState } from 'react';    
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';

//모듈 외부로 넘기기, 이름은 자유로 설정 가능, 함수형(네비로 화면 이동 가능)
export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState(''); //useState로 빈문자열 생성, email에 넣고, setEmail함수 호출
  const [password, setPassword] = useState(''); 

  // async 비동기 함수시작 
  const handleSignup = async () => {
    if (!email || !password) {  //email, password 비었거나 null인지 판단
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력하세요.'); //알람
      return;
    }


    try {
      const response = await fetch('http://172.17.128.94:8080/register', {
        method: 'POST',
         headers: {
         'Content-Type': 'application/json',  //표준 MIME 에서 json 형태
         },
         body: JSON.stringify({ email, password }),
        });


        const json = await response.json();
        console.log('서버 응답:', json); // 

      if (response.ok) {
        Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
        navigation.navigate('Login');
      } else {
        const errData = await response.json();
        Alert.alert('회원가입 실패', errData.message || '서버 오류');
      }
    } catch (error) {
      Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
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
      <Button title="회원가입" onPress={handleSignup} />
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
});
