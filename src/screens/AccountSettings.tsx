// screens/AccountSettings.tsx
import React, { useMemo, useState, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import api from "../api/apiClient"; // 저장 시에만 사용(진입시 GET 안 함)
import { UserContext } from "./UserContext"; // userId, name, setName 제공

import * as SecureStore from "expo-secure-store"; // 토큰 저장 및 삭제
import AsyncStorage from "@react-native-async-storage/async-storage";

type AccountSettingsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AccountSettings">;
};

const AccountSettings = ({ navigation }: AccountSettingsProps) => {
  const insets = useSafeAreaInsets();
  const { name: ctxName, setName: setCtxName } = useContext(UserContext);

  // 헤더 타이틀
  useLayoutEffect(() => {
    navigation.setOptions({ title: "계정 설정" });
  }, [navigation]);

  // ✅ 진입 시 서버 호출 없이, 컨텍스트 값으로만 초기 세팅
  const [name, setName] = useState<string>(ctxName || "");
  const [email, setEmail] = useState<string>(""); // 서버콜 안 하므로 비어있을 수 있음

  // 초기값 저장 (변경 감지용)
  const [initialName, setInitialName] = useState<string>(ctxName || "");
  const [initialEmail, setInitialEmail] = useState<string>("");

  // 비밀번호 변경(옵션)
  const [enablePwChange, setEnablePwChange] = useState<boolean>(false);
  const [currentPw, setCurrentPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    pw?: string;
  }>({});

  // 검증
  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "이름을 입력해주세요.";
    if (!email.trim()) next.email = "이메일을 입력해주세요.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "이메일 형식이 이상합니다.";

    if (enablePwChange) {
        if (!currentPw) next.pw = "현재 비밀번호 입력해주세요.";
      else if (newPw.length < 8) next.pw = "새 비밀번호는 8자 이상이 좋습니다.";
      else if (newPw !== confirmPw)
        next.pw = "새 비밀번호 확인이 일치하지 않습니다.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 변경 여부 감지
  const isDirty = useMemo(() => {
    const nameChanged = name !== initialName;
    const emailChanged = email !== initialEmail;
    const pwChanged = enablePwChange && (!!currentPw || !!newPw || !!confirmPw);
    return nameChanged || emailChanged || pwChanged;
  }, [
    name,
    email,
    initialName,
    initialEmail,
    enablePwChange,
    currentPw,
    newPw,
    confirmPw,
  ]);

  // 저장: 진입 시엔 서버콜 안 하고, **저장 버튼에서만** 호출
  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      // 이름/이메일 업데이트 (엔드포인트/키 이름은 프로젝트에 맞게)
      await api.put("/api/user/me", { name: name.trim(), email: email.trim() });
      setCtxName(name.trim()); // 컨텍스트 동기화

      // 초기값 업데이트 (변경 감지용)
      setInitialName(name.trim());
      setInitialEmail(email.trim());

      if (enablePwChange) {
        await api.post("/api/user/change-password", {
          currentPassword: currentPw,
          newPassword: newPw,
        });
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setEnablePwChange(false);
      }

      Alert.alert("완료", "정보가 저장됐습니다.");
    } catch (e: any) {
      let msg = "저장 중 문제가 생겼습니다.";
      
      // 서버에서 오는 구체적인 에러 메시지 처리
      if (e?.response?.data?.message) {
        const serverMsg = e.response.data.message;
        if (serverMsg.includes("비밀번호") || serverMsg.includes("password")) {
          msg = "현재 비밀번호가 올바르지 않습니다.";
        } else if (serverMsg.includes("이메일") || serverMsg.includes("email")) {
          msg = "이미 사용 중인 이메일입니다.";
        } else {
          msg = serverMsg;
        }
      } else if (e?.message) {
        msg = e.message;
      }
      
      Alert.alert("오류", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: 24 + insets.bottom },
          ]}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.container}>
            {/* 기본 정보 */} 
            <Text style={styles.sectionTitle}>기본 정보</Text>

            <View style={styles.field}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력해주세요."
                placeholderTextColor="#999"
                autoCapitalize="none"
                maxLength={30}
              />
              {!!errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="example@email.com"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              {!!errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* 비밀번호 변경 토글 */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setEnablePwChange((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTitle}>비밀번호 변경</Text>
              <Text style={styles.toggleText}>
                {enablePwChange ? "숨기기 ▲" : "펼치기 ▼"}
              </Text>
            </TouchableOpacity>

            {/* 비밀번호 변경 영역 */}
            {enablePwChange && (
              <View style={styles.card}>
                <View style={styles.field}>
                  <Text style={styles.label}>현재 비밀번호</Text>
                  <TextInput
                    style={styles.input}
                    value={currentPw}
                    onChangeText={setCurrentPw}
                    secureTextEntry
                    placeholder="현재 비밀번호를 입력해주세요."
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>새 비밀번호</Text>
                  <TextInput
                    style={styles.input}
                    value={newPw}
                    onChangeText={setNewPw}
                    secureTextEntry
                    placeholder="새 비밀번호를 입력해주세요. (8자 이상)"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>새 비밀번호 확인</Text>
                  <TextInput
                    style={[styles.input, errors.pw && styles.inputError]}
                    value={confirmPw}
                    onChangeText={setConfirmPw}
                    secureTextEntry
                    placeholder="새 비밀번호를 다시 입력해주세요."
                    placeholderTextColor="#999"
                  />
                </View>

                {!!errors.pw && (
                  <Text style={styles.errorText}>{errors.pw}</Text>
                )}
              </View>
            )}

            {/* 버튼들 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  (!isDirty || saving) && styles.btnDisabled,
                ]}
                onPress={handleSave}
                disabled={!isDirty || saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.primaryBtnText}>저장</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryBtnText}>로그아웃</Text>
              </TouchableOpacity>
            </View>

            {/* 탈퇴 (옵션) */}
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() =>
                Alert.alert("계정 탈퇴", "정말로 탈퇴하시겠습니까?", [
                  { text: "취소", style: "cancel" },
                  {
                    text: "탈퇴",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await api.delete("/api/user/me");
                        Alert.alert("완료", "계정이 삭제되었습니다.");
                      } catch (e: any) {
                        Alert.alert(
                          "오류",
                          e?.response?.data?.message ??
                            e?.message ??
                            "탈퇴 실패"
                        );
                      }
                    },
                  },
                ])
              }
            >
              {/* <Text style={styles.dangerBtnText}>계정 탈퇴</Text> */}
                         </TouchableOpacity>
           </View>
         </ScrollView>
       </KeyboardAvoidingView>

       {/* 로그아웃 모달 */}
       <Modal
         animationType="fade"
         transparent={true}
         visible={logoutModalVisible}
         onRequestClose={() => setLogoutModalVisible(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>로그아웃 하시겠습니까?</Text>
             <View style={styles.modalButtonRow}>
               <TouchableOpacity
                 style={[styles.modalButton, styles.modalCancelButton]}
                 onPress={() => setLogoutModalVisible(false)}
               >
                 <Text style={styles.modalCancelButtonText}>아니오</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={[styles.modalButton, styles.modalConfirmButton]}
                 onPress={async () => {
                   try {
                     console.log("🚪 로그아웃 시작");
                     
                     // AsyncStorage 초기화 (SettingScreen 방식)
                     await AsyncStorage.removeItem("accessToken");
                     await AsyncStorage.removeItem("refreshToken");
                     await AsyncStorage.removeItem("userId");
                     
                     // SecureStore 토큰 삭제
                     await SecureStore.deleteItemAsync("auth_tokens");
                     
                     // 컨텍스트 초기화
                     setCtxName("");
                     
                     // 모달 닫기
                     setLogoutModalVisible(false);
                     
                     // 로그인 화면으로 이동
                     navigation.reset({
                       index: 0,
                       routes: [{ name: "Login" }],
                     });
                     
                     console.log("✅ 로그아웃 완료");
                   } catch (error) {
                     console.error("❌ 로그아웃 에러:", error);
                     Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
                   }
                 }}
               >
                 <Text style={styles.modalConfirmButtonText}>예</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
     </SafeAreaView>
   );
 };

export default AccountSettings;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: "#fff" },
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  field: { marginBottom: 12 },
  label: { fontSize: 13, color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#ff5a5a" },
  errorText: { marginTop: 6, color: "#ff3b30", fontSize: 12 },
  toggleRow: {
    marginTop: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleText: { fontSize: 13, color: "#666" },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    overflow: "visible",
  },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: "#111827", fontSize: 15, fontWeight: "600" },
  dangerBtn: { marginTop: 18, alignItems: "center", padding: 10 },
  dangerBtnText: {
    color: "#d11",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 15,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#bbb",
  },
  modalCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalConfirmButton: {
    backgroundColor: "#FF9898",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
