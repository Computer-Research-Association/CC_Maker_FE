import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/apiClient";
import { RootStackParamList } from "../navigation/types";
import * as Clipboard from "expo-clipboard";
import styles from "../styles/TeamLeaderScreen.styles";

type InviteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "InviteScreen">;
};

export default function InviteScreen({ navigation }: InviteScreenProps) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // ⭐ 단계 상태 추가

  const fetchInviteCode = async () => {
    try {
      setLoading(true);
      console.log("🚀 fetchInviteCode 실행");
      // AsyncStorage에서 토큰 가져오기 (apiClient 내부에서 헤더 붙이지만, 혹시 토큰 없으면 미리 확인)
      const accessToken = await AsyncStorage.getItem("ACCESS_TOKEN");
      if (!accessToken) {
        Alert.alert("로그인 필요", "로그인 후 이용해주세요.");
        setLoading(false);
        return;
      }
      // request code
      const response = await api.post("/api/invitecode/create");

      if (response.data?.code) {
        setTeamCode(response.data.code);
        Alert.alert("성공", "초대코드가 생성되었습니다.");
      } else {
        Alert.alert("오류", "초대코드 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("초대코드 생성 실패:", error);
      Alert.alert("오류", "초대코드 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (teamCode) {
      await Clipboard.setStringAsync(teamCode);
      Alert.alert("복사 완료", "팀 코드가 복사되었습니다!");
    }
  };

  const onCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert("입력 오류", "팀 이름을 입력해주세요.");
      return;
    }
    try {
      await api.post("/api/invitecode/teamname", {
        teamName: teamName,
      });
      setStep(2); // 2단계로 이동
    } catch (error) {
      console.error("팀 생성 실패:", error);
      Alert.alert("오류", "팀 생성에 실패했습니다.");
    }
  };

  const onStartPress = async () => {
    navigation.navigate("MainHomeScreen");
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>팀이름을 입력해주세요</Text>
          <Text style={styles.subtitle}>깔쌈하게 만들어주세요</Text>

          <TextInput
            style={styles.input}
            placeholder="팀명"
            value={teamName}
            onChangeText={setTeamName}
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity style={styles.Button} onPress={onCreateTeam}>
            <Text style={styles.laterButtonText}>팀 생성하기</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <TouchableOpacity
            style={styles.Button}
            onPress={fetchInviteCode}
            disabled={loading}
          >
            <Text style={styles.laterButtonText}>
              {loading ? "생성 중..." : "팀 코드 생성"}
            </Text>
          </TouchableOpacity>

          {teamCode !== "" && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.codeText}>생성된 팀 코드: {teamCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Text style={styles.copyButtonText}>코드 복사하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.startButton}
                onPress={onStartPress}
              >
                <Text style={styles.startButtonText}>시작하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
