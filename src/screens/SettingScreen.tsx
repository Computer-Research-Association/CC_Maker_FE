import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "../screens/TeamContext";
import api from "../api/apiClient";
import * as Clipboard from "expo-clipboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "../component/SubmitButton";
// 분리된 스타일 파일
import creditModalStyles from "../styles/SettingScreen/CreditModalStyles";
import inquiryModalStyles from "../styles/SettingScreen/InquiryModalStyles";
import inviteCodeModalStyles from "../styles/SettingScreen/InviteModalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
type SettingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SettingScreen">;
};

export default function SettingsScreen({ navigation }: SettingScreenProps) {
  const { role, teamId } = useContext(TeamContext);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [minCreditModalVisible, setMinCreditModalVisible] = useState(false);
  const [minScore, setMinScore] = useState("");
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);

  useEffect(() => {
    console.log("현재 role:", role);
  }, [role]);
  
  useEffect(() => {
  const checkMatchingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(`@matching_started_team_${teamId}`);
      if (value === "true") {
        setIsMatchingStarted(true);
      }
    } catch (error) {
      console.warn("AsyncStorage 불러오기 실패", error);
    }
  };

  if (teamId) checkMatchingStatus();
}, [teamId]);


  const createInviteCode = async () => {
    try {
      const response = await api.post("/api/invitecode/create", { teamId });
      const code = response.data.inviteCode || response.data.code;
      setInviteCode(code);
      setModalVisible(true);
    } catch (error) {
      console.error("초대 코드 생성 실패:", error);
      Alert.alert("오류", "초대 코드 생성 중 문제가 발생했습니다.");
    }
  };

  const copyToClipboard = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("복사 완료", "초대 코드가 클립보드에 복사되었습니다.");
    }
  };

  const saveMinScore = async () => {
    const parsedScore = parseInt(minScore, 10);
    if (isNaN(parsedScore) || parsedScore < 0) {
      Alert.alert("오류", "유효한 최소 학점을 입력해주세요.");
      return;
    }
    try {
      await api.post(`/api/team/${teamId}/min-credit`, {
        minScore: parsedScore,
      });
      Alert.alert("성공", "최소 학점이 저장되었습니다.");
      setMinCreditModalVisible(false);
    } catch (error) {
      console.error("최소 학점 저장 실패:", error);
      Alert.alert("오류", "최소 학점 저장에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>내 계정</Text>
      <SettingItem label="계정 관리" onPress={() => {}} />
      <SettingItem label="알림 설정" onPress={() => {}} />

      <Text style={styles.sectionTitle}>서비스</Text>
      <SettingItem
        label="문의하기"
        onPress={() => setInquiryModalVisible(true)}
        external
      />
      {role === "LEADER" && (
        <>
          <SettingItem
            label="초대 코드 생성"
            onPress={createInviteCode}
            external
          />
          {!isMatchingStarted && (
            <SettingItem
              label="매칭 시작하기"
              onPress={() => {
                navigation.navigate("CheckScreen");
              }}
              external
            />
          )}

          <SettingItem
            label="최소학점 설정"
            onPress={() => setMinCreditModalVisible(true)}
            external
          />
        </>
      )}

      {/* 초대 코드 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={inviteCodeModalStyles.modalOverlay}>
          <View style={inviteCodeModalStyles.modalContent}>
            <Text style={inviteCodeModalStyles.modalTitle}>초대 코드</Text>
            <View style={inviteCodeModalStyles.codeBox}>
              <Text style={inviteCodeModalStyles.codeText}>{inviteCode}</Text>
              <TouchableOpacity
                onPress={copyToClipboard}
                style={inviteCodeModalStyles.iconButton}
              >
                <Ionicons name="copy-outline" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            <SubmitButton
              onPress={() => setModalVisible(false)}
              title="취소"
              width={130}
              height={50}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              style={{ marginTop: 2 }}
            >
              <Text style={inviteCodeModalStyles.closeText}>닫기</Text>
            </SubmitButton>
          </View>
        </View>
      </Modal>

      {/* 문의하기 모달 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={inquiryModalVisible}
        onRequestClose={() => setInquiryModalVisible(false)}
      >
        <View style={inquiryModalStyles.modalOverlay}>
          <View style={inquiryModalStyles.modalContent}>
            <Text style={inquiryModalStyles.modalTitle}>문의하기</Text>
            <Text style={inquiryModalStyles.modalCode}>
              문의는 아래 이메일로 보내주세요.
            </Text>
            <Text style={inquiryModalStyles.modalCodeEmail}>
              📧 example@email.com
            </Text>

            <SubmitButton
              title="확인"
              buttonColor="#bbb"
              width={130}
              height={50}
              shadowColor="#aaa"
              onPress={() => setInquiryModalVisible(false)}
              style={{ marginTop: 2 }}

              // style={inquiryModalStyles.closeButton}
            ></SubmitButton>
          </View>
        </View>
      </Modal>

      {/* 최소 학점 모달 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={minCreditModalVisible}
        onRequestClose={() => setMinCreditModalVisible(false)}
      >
        <View style={creditModalStyles.modalOverlay}>
          <View style={creditModalStyles.modalContent}>
            <Text style={creditModalStyles.modalTitle}>최소 학점 설정</Text>
            <Text style={creditModalStyles.modalCode}>
              원하는 최소 학점을 입력해주세요
            </Text>
            <TextInput
              style={creditModalStyles.input}
              placeholder="예: 30"
              keyboardType="numeric"
              value={minScore}
              onChangeText={setMinScore}
            />
            <View style={creditModalStyles.buttonRow}>
              <SubmitButton
                title="취소"
                buttonColor="#bbb"
                width={130}
                height={50}
                shadowColor="#aaa"
                onPress={() => setMinCreditModalVisible(false)}
                style={{ marginTop: 2 }}
                // style={creditModalStyles.cancelButton}
              ></SubmitButton>
              <SubmitButton
                title="확인"
                width={130}
                height={50}
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                // style={creditModalStyles.confirmButton}
                onPress={saveMinScore}
                style={{ marginTop: 2 }}
              ></SubmitButton>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function SettingItem({ label, onPress, external }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>{external ? "↗" : "›"}</Text>
    </TouchableOpacity>
  );
}

type SettingItemProps = {
  label: string;
  onPress: () => void;
  external?: boolean;
};

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
});
