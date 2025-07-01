import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert  } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // 네비게이션 타입 정의된 파일
import * as Clipboard from 'expo-clipboard';

type SchoolRegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function SchoolRegisterScreen({ navigation }: SchoolRegisterScreenProps) {
  const [schoolName, setSchoolName] = useState('');
  const [teamCode, setTeamCode] = useState('');

  
  const generateTeamCode = () => {
    // 간단한 6자리 영문+숫자 코드 생성
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTeamCode(code);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(teamCode);
    Alert.alert('복사 완료', '팀 코드가 복사되었습니다!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>팀이름을 입력해주세요</Text>
      <Text style={styles.subtitle}>깔쌈하게 만들어주세요</Text>

      <TextInput
        style={styles.input}
        placeholder="팀명"
        value={schoolName}
        onChangeText={setSchoolName}
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity style={styles.Button} onPress={generateTeamCode}>
        <Text style={styles.laterButtonText}>팀 코드생성</Text>
      </TouchableOpacity>

      {teamCode !== '' && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.codeText}>생성된 팀 코드: {teamCode}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>코드 복사하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.startButton} >
                  <Text style={styles.startButtonText}>시작하기</Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f7f8fa',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  Button: {
    marginTop: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  laterButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
    codeText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
   copyButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#FF9898',
    borderRadius: 30,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#FF9898',
    paddingVertical: 14,
    paddingHorizontal: 140,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 200,
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
