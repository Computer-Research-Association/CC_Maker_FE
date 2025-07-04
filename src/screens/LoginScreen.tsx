import React, { useState } from 'react';
import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; //네비게이션을 타입안정성있게 쓰기 위한 도구 
import { login } from '../api/authApi';
import styles from '../styles/LoginScreen.styles';


type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};//이 컴포넌트는 navigation이라는 prop을 받고, 객체로 타입을 지정해준다. 

export default function LoginScreen({ navigation }: LoginScreenProps) {//react는 객체로 props를 받음
  const [email, setemail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      Alert.alert('로그인 성공', '환영합니다!');
        navigation.navigate('Home');

    } catch (error: unknown) { // 다시 공부 하기 =
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      Alert.alert('로그인 실패', errorMessage); //팝업 에러 메세지
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
