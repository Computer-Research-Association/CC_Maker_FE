import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import api from "../api/apiClient";
import { RootStackParamList } from "../navigation/types";
import * as Clipboard from "expo-clipboard";
import styles from "../styles/TeamLeaderScreen.styles";
import { TeamContext } from "./TeamContext";
import SubmitButton from "../component/SubmitButton";
type InviteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "InviteScreen">;
};

export default function InviteScreen({ navigation }: InviteScreenProps) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { teamId, setTeamId } = useContext(TeamContext);

  //초대코드 생성(백엔드에서 호출)
  const fetchInviteCode = async () => {
    try {
      setLoading(true);
      console.log(" fetchInviteCode 실행");

      //  수정된 부분: auth_tokens에서 accessToken 추출
      const tokenData = await SecureStore.getItemAsync("auth_tokens");
      const accessToken = tokenData ? JSON.parse(tokenData).accessToken : null;

      console.log("정상적으로 작동하는토큰 :", accessToken);

      if (!accessToken) {
        Alert.alert("로그인 필요", "로그인 후 이용해주세요.");
        setLoading(false);
        return;
      }

      const response = await api.post("/api/invitecode/create", {
        teamId: teamId,
      });

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
  //초대코드 복사
  const copyToClipboard = async () => {
    if (teamCode) {
      await Clipboard.setStringAsync(teamCode);
      Alert.alert("복사 완료", "팀 코드가 복사되었습니다!");
    }
  };
  //팀 생성
  const onCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert("입력 오류", "팀 이름을 입력해주세요.");
      return;
    }
    try {
      const response = await api.post("/api/invitecode/teamname", {
        teamName: teamName,
      });

      console.log("팀 생성 응답:", JSON.stringify(response, null, 2));

      if (!response.data) {
        Alert.alert("오류", "서버에서 데이터를 받지 못했습니다.");
        return;
      }

      const { teamId, teamName: savedTeamName } = response.data;

      if (teamId) {
        setTeamId(teamId);
        console.log("✅ teamId 저장됨:", teamId);
        setStep(2);
      } else {
        Alert.alert("오류", "팀 생성 후 teamId를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("팀 생성 실패:", error);
      Alert.alert("오류", "팀 생성에 실패했습니다.");
    }
  };

  //시작하기 버튼 클릭 시 팀 생성 후 홈화면으로 이동
    const onStartPress = async () => {
     navigation.reset({
        index: 0,
        routes: [{ name: "MainHomeScreen" }],
      });
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

          <SubmitButton
            // style={styles.Button}
            onPress={onCreateTeam}
            title="팀 생성하기"
            buttonColor="#FFFFFF"
            shadowColor="#ddd"
            textColor="#808080"
          >
            {/* <Text style={styles.laterButtonText}>팀 생성하기</Text> */}
          </SubmitButton>
        </>
      )}
      {step === 2 && (
        <>
          <SubmitButton
            title="팀코드 생성하기"
            // style={styles.Button}
            buttonColor="#FFFFFF"
            shadowColor="#ddd"
            onPress={fetchInviteCode}
            disabled={loading}
            textColor="#808080"
          >
            <Text style={styles.laterButtonText}>
              {loading ? "생성 중..." : "팀 코드 생성"}
            </Text>
          </SubmitButton>

          {teamCode !== "" && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.codeText}>생성된 팀 코드: {teamCode}</Text>
              <SubmitButton
                title="코드복사하기"
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                // style={styles.copyButton}
                onPress={copyToClipboard}
              >
                {/* <Text style={styles.copyButtonText}>코드 복사하기</Text> */}
              </SubmitButton>

              <SubmitButton
                title="시작하기"
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                onPress={onStartPress}
              >
                <Text style={styles.startButtonText}>시작하기</Text>
              </SubmitButton>
            </View>
          )}
        </>
      )}
    </View>
  );
}
