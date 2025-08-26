import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "../screens/TeamContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "../component/SubmitButton";
import creditModalStyles from "../styles/SettingScreen/CreditModalStyles";
import inquiryModalStyles from "../styles/SettingScreen/InquiryModalStyles";
import inviteCodeModalStyles from "../styles/SettingScreen/InviteModalStyles";
import { useInviteCode } from "../hooks/useInviteCode";
import { useMinCredit } from "../hooks/useMinCredit";
import { useLogout } from "../hooks/useLogout";
import { useMatchingStatus } from "../hooks/useMatchingStatus";
import { InviteCodeModal } from "../component/InviteCodeModal";
import { InquiryModal } from "../component/InquiryModal";
import { MinCreditModal } from "../component/MinCreditModal";
import { LogoutModal } from "../component/LogoutModal";
import BackButton from "../component/BackButton";

type SettingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SettingScreen">;
};

export default function SettingsScreen({ navigation }: SettingScreenProps) {
  const { role, teamId } = useContext(TeamContext);

  const { inviteCode, modalVisible, createInviteCode, copyToClipboard, closeModal } = useInviteCode(String(teamId ?? ""));
  const { modalVisible: minCreditModalVisible, minScore, setMinScore, openModal, closeModal: closeMinModal, saveMinScore } = useMinCredit(String(teamId ?? ""));
  const { modalVisible: logoutModalVisible, openModal: openLogout, closeModal: closeLogout, handleLogout } = useLogout(navigation);
  const { isMatchingStarted } = useMatchingStatus(String(teamId ?? ""));
  const [inquiryModalVisible, setInquiryModalVisible] = React.useState(false);

  return (
    <View style={styles.screenContainer}>
             {/* 뒤로가기 버튼 */}
       <BackButton />
      
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>내 계정</Text>
        <SettingItem
          label="계정 관리"
          onPress={() => navigation.navigate("AccountSettings")}
          external
        />

        <SettingItem label="로그아웃" onPress={openLogout} />

        <Text style={styles.sectionTitle}>서비스</Text>
        <SettingItem
          label="문의하기"
          onPress={() => setInquiryModalVisible(true)}
          external
        />
        {role === "LEADER" && (
          <>
            <SettingItem label="초대 코드 생성" onPress={createInviteCode} external />
            {!isMatchingStarted && (
              <SettingItem label="매칭 시작하기" onPress={() => navigation.navigate("CheckScreen")} external />
            )}
            {isMatchingStarted && (
              <SettingItem label="최소학점 설정" onPress={openModal} external />
            )}
          </>
        )}

        {/* 모달 컴포넌트 적용 */}
        <InviteCodeModal visible={modalVisible} inviteCode={inviteCode} onCopy={copyToClipboard} onClose={closeModal} />
        <InquiryModal visible={inquiryModalVisible} onClose={() => setInquiryModalVisible(false)} />
        <MinCreditModal visible={minCreditModalVisible} minScore={minScore} onMinScoreChange={setMinScore} onSave={saveMinScore} onCancel={closeMinModal} />
        <LogoutModal visible={logoutModalVisible} onCancel={closeLogout} onConfirm={handleLogout} />
      </ScrollView>
    </View>
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
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60, // 뒤로가기 버튼 공간 확보
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
    fontFamily: "Ongeulip",
    color: "#111",
  },
  arrow: {
    fontSize: 18,
    color: "#ccc",
  },
});
