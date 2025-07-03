import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { joinTeamByCode } from '../api/teamApi';
import styles from '../styles/JoinTeamScreem.styles';


type JoinTeamScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JoinTeam'>;
};

export default function PrivateScreen({ navigation }: JoinTeamScreenProps) {
  const [code, setCode] = useState('');

  const handleJoinTeam = async () => {
    if(!code.trim()) {
      Alert.alert('입력 오류', '초대코드를 입력해주세요.');
      return;
    }

    try {
      await joinTeamByCode(code);
      Alert.alert('팀 가입 완료', '성공적으로 팀에 가입했습니다!');
      navigation.navigate('Home',); // 필요 시 다른 화면으로 이동
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('가입 실패', error.message);
      } else {
        Alert.alert('가입 실패', '팀 가입 중 오류가 발생했습니다.');
      }
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여긴 개인화면!</Text>
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
