import React, { useState } from 'react';
import {View,TextInput,Alert,Text,TouchableOpacity,StyleSheet,} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { login } from '../api/authApi';
import { RootStackParamList } from '../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [autoLogin, setAutoLogin] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      console.log('로그인 성공!', response.accessToken);  //나중에 로그 지우기
      Alert.alert('로그인 성공', '환영합니다!');
      // navigation.navigate('Home'); // 필요 시 활성화
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      Alert.alert('로그인 실패', errorMessage); //팝업 에러 메세지
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="sample@gmail.com"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
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

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: '#ffe6cc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
  },
  signupText: {
    marginTop: 15,
    color: 'black',
    textAlign: 'right',
    opacity: 0.7,
  },
  roundButton: {
    backgroundColor: '#f4a261',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  roundButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});