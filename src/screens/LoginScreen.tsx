import React, { useState } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { login } from '../api/authApi';


type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setemail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleLogin = async () => {
    try {
      await login({ email, password });
      console.log('로그인 성공!');  // 토큰은 내부에서 저장됨
      Alert.alert('로그인 성공', '환영합니다!');
      navigation.navigate('Home'); // 필요 시 활성화
    }catch (error: any) {
    const errorMessage = error.response?.data?.message || "로그인 실패";
    Alert.alert("오류", errorMessage);
    }
  };

  
  return (
    <View style={styles.container}>

      {/* <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/sco/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/768px-Starbucks_Corporation_Logo_2011.svg.png',
        }}
        style={styles.logo}
      /> */}

      <Text style={styles.subText}>팀cc맞춤형 플랫폼</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={email}
        onChangeText={setemail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.linkRow}>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity  onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>회원가입</Text></TouchableOpacity>
        {/* <Text style={styles.separator}>|</Text> */}

      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 300,
    backgroundColor: '#fff',
  },

  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  link: {
    color: '#FF9898',
    marginHorizontal: 5,
  },
  separator: {
    color: '#aaa',
  },
  loginButton: {
    backgroundColor: '#FF9898',
    paddingVertical: 14,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});