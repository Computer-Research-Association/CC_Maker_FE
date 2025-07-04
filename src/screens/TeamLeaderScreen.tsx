import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert  } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // 네비게이션 타입 정의된 파일
import * as Clipboard from 'expo-clipboard';
import styles from '../styles/TeamLeaderScreen.styles';
type TeamLeaderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TeamLeaderScreen'>;
};

export default function TeamMemberScreen({ navigation }: TeamLeaderScreenProps) {
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


