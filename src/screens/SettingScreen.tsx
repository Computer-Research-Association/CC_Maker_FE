import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "../screens/TeamContext";
import api from "../api/apiClient";
import * as Clipboard from "expo-clipboard"; // 복사 기능 (Expo)

type SettingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SettingScreen">;
};

export default function SettingsScreen({ navigation }: SettingScreenProps) {
  const { role, teamId } = useContext(TeamContext);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    console.log("현재 role:", role);
  }, [role]);

  // ✅ 초대 코드 생성
  const createInviteCode = async () => {
    try {
      const response = await api.post("/api/invitecode/create", {
        teamId: teamId,
      });
      console.log("초대 코드 생성 성공:", response.data);
      setInviteCode(response.data.inviteCode); // API 응답에 맞게 key 확인
      Alert.alert("성공", "초대 코드가 생성되었습니다!");
    } catch (error) {
      console.error("초대 코드 생성 실패:", error);
      Alert.alert("오류", "초대 코드 생성 중 문제가 발생했습니다.");
    }
  };

  // ✅ 복사하기
  const copyToClipboard = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("복사 완료", "초대 코드가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>내 계정</Text>
      <SettingItem label="계정 관리" onPress={() => {}} />
      <SettingItem label="알림 설정" onPress={() => {}} />

      <Text style={styles.sectionTitle}>서비스</Text>
      <SettingItem label="문의하기" onPress={() => {}} external />

      {role === "LEADER" && (
        <>
          <SettingItem label="초대 코드 생성" onPress={createInviteCode} external />
          
          {/* ✅ 초대 코드 보여주기 + 복사 버튼 */}
          {inviteCode && (
            <View style={styles.inviteContainer}>
              <Text style={styles.inviteText}>초대 코드: {inviteCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyText}>복사하기</Text>
              </TouchableOpacity>
            </View>
          )}

          <SettingItem
            label="매칭 시작하기"
            onPress={() => navigation.navigate("CheckScreen")}
            external
          />
        </>
      )}
    </ScrollView>
  );
}

type SettingItemProps = {
  label: string;
  onPress: () => void;
  external?: boolean;
};

function SettingItem({ label, onPress, external }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>{external ? "↗" : "›"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  arrow: {
    fontSize: 18,
    color: "#ccc",
  },
  inviteContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    alignItems: "center",
  },
  inviteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  copyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  copyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
