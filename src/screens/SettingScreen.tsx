import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false); // ✅ 모달 상태
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);

  useEffect(() => {
    console.log("현재 role:", role);
  }, [role]);

  // ✅ 초대 코드 생성
  const createInviteCode = async () => {
    try {
      const response = await api.post("/api/invitecode/create", {
        teamId: teamId,
      });

      const code = response.data.inviteCode || response.data.code;
      setInviteCode(code);
      setModalVisible(true); // ✅ 모달 열기
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
          <SettingItem
            label="매칭 시작하기"
            onPress={() => navigation.navigate("CheckScreen")}
            external
          />
          매칭시작하는것
        </>
      )}

      {/* ✅ 모달로 초대 코드 보여주기 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>초대 코드</Text>
            <Text style={styles.modalCode}>{inviteCode}</Text>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Text style={styles.copyText}>복사하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={inquiryModalVisible}
        onRequestClose={() => setInquiryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>문의하기</Text>
            <Text style={styles.modalCode}>
              문의는 아래 이메일로 보내주세요.{"\n"}
              📧 example@email.com
            </Text>

            <TouchableOpacity
              onPress={() => setInquiryModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// 개별 설정 아이템 컴포넌트
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

// 스타일
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

  // ✅ 모달 관련 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 280,
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalCode: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
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
  closeButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeText: {
    color: "#888",
  },
});
