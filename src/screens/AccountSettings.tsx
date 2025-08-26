// screens/AccountSettings.tsx
import React, { useLayoutEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../api/apiClient"; // 저장 시에만 사용(진입시 GET 안 함)
import { UserContext } from "./UserContext"; // userId, name, setName 제공
import { useAccountSettings } from "../hooks/useAccountSettings";
import { LabeledInput } from "../component/LabledInput";
import { PasswordSection } from "../component/PasswordSection";
import SubmitButton from "../component/SubmitButton";
import { LogoutModal } from "../component/LogoutModal";
import styles from "../styles/AccountSettingsStyles";
import BackButton from "../component/BackButton";

type AccountSettingsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AccountSettings">;
};

const AccountSettings = ({ navigation }: AccountSettingsProps) => {
  const insets = useSafeAreaInsets();
  const { name: ctxName, setName: setCtxName } = useContext(UserContext);



  const {
    state: {
      name,
      email,
      enablePwChange,
      currentPw,
      newPw,
      confirmPw,
      errors,
      saving,
      logoutModalVisible,
    },
    set: {
      setName,
      setEmail,
      setEnablePwChange,
      setCurrentPw,
      setNewPw,
      setConfirmPw,
    },
    computed: { isDirty },
    actions: {
      handleSave,
      openLogout,
      closeLogout,
      confirmLogout,
      confirmDelete,
    },
  } = useAccountSettings({ name: ctxName || "", email: "user@example.com" }); // 임시 이메일 값으로 초기화

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "bottom"]}
    >
      {/* 뒤로가기 버튼 */}
      <BackButton />
      
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

            <LabeledInput
              label="이름"
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력해주세요."
              autoCapitalize="none"
              maxLength={30}
              error={errors.name}
            />

            <LabeledInput
              label="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="example@email.com"
              autoCapitalize="none"
              error={errors.email}
            />

            <PasswordSection
              enable={enablePwChange}
              setEnable={setEnablePwChange}
              currentPw={currentPw}
              setCurrentPw={setCurrentPw}
              newPw={newPw}
              setNewPw={setNewPw}
              confirmPw={confirmPw}
              setConfirmPw={setConfirmPw}
              error={errors.pw}
            />

            {/* 버튼들 */}
            <View style={styles.buttonRow}>
              <SubmitButton
                title="저장"
                onPress={handleSave}
                disabled={!isDirty || saving}
                width={140}
                height={48}
                buttonColor="#111827"
                shadowColor="#444"
              />
              <SubmitButton
                title="로그아웃"
                onPress={openLogout}
                width={140}
                height={48}
                buttonColor="#fff"
                shadowColor="#ddd"
                textColor="#111827"
              />
            </View>
            {/* 탈퇴 (옵션)후에 삭제시키기기*/}
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
      <LogoutModal
        visible={logoutModalVisible}
        onCancel={closeLogout}
        onConfirm={async () => {
          await confirmLogout();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }}
      />
     </SafeAreaView>
   );
 };

export default AccountSettings;

// styles 분리: ../styles/AccountSettingsStyles
