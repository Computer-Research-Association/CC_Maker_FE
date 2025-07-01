// src/screens/JoinTeamScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { joinTeamByCode } from '../api/teamApi';

type JoinTeamScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JoinTeam'>;
};

export default function JoinTeamScreen({ navigation }: JoinTeamScreenProps) {
  const [code, setCode] = useState('');

  const handleJoinTeam = async () => {
    if(!code.trim()) {
      Alert.alert('입력 오류', '초대코드를 입력해주세요.');
      return;
    }

    try {
      await joinTeamByCode(code);
      Alert.alert('팀 가입 완료', '성공적으로 팀에 가입했습니다!');
      navigation.navigate('Home'); // 필요 시 다른 화면으로 이동
    } catch (error: any) {
      Alert.alert('가입 실패', error.message || '팀 가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>초대 코드로 팀 가입</Text>
      <TextInput
        placeholder="초대코드를 입력하세요"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinTeam}>
        <Text style={styles.buttonText}>팀 가입하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fffbe0',
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f4a261',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
