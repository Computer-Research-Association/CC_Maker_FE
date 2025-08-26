import { useCallback, useMemo, useState, useContext } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService } from "../services/userServices";
import { validateAccount, FieldErrors } from "../utils/validators";
import { UserContext } from "../screens/UserContext";

// 상수 정의
const DEFAULT_ERROR_MESSAGE = "저장 중 문제가 생겼습니다.";
const SUCCESS_MESSAGE = "정보가 저장됐습니다.";
const PASSWORD_ERROR_MESSAGE = "현재 비밀번호가 올바르지 않습니다.";
const EMAIL_ERROR_MESSAGE = "이미 사용 중인 이메일입니다.";

// 타입 정의
type ServerError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export const useAccountSettings = (initial: {
  name: string;
  email: string;
}) => {
  const { setName: setCtxName } = useContext(UserContext);

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  
  // 비밀번호 섹션 상태
  const [enablePwChange, setEnablePwChange] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  
  // 에러, 저장, 모달
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  // 변경 감지
  const [initialName, setInitialName] = useState(initial.name);
  const [initialEmail, setInitialEmail] = useState(initial.email);

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

  // 비밀번호 변경 처리
  const handlePasswordChange = useCallback(async () => {
    if (!enablePwChange) return;
    
    await userService.changePassword(currentPw, newPw);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setEnablePwChange(false);
  }, [enablePwChange, currentPw, newPw]);

  // 에러 메시지 처리
  const getErrorMessage = useCallback((error: ServerError): string => {
    if (error?.response?.data?.message) {
      const serverMsg = error.response.data.message;
      if (/(비밀번호|password)/.test(serverMsg)) {
        return PASSWORD_ERROR_MESSAGE;
      } else if (/(이메일|email)/.test(serverMsg)) {
        return EMAIL_ERROR_MESSAGE;
      }
      return serverMsg;
    } else if (error?.message) {
      return error.message;
    }
    return DEFAULT_ERROR_MESSAGE;
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    const { ok, errors } = validateAccount({
      name,
      email,
      enablePwChange,
      currentPw,
      newPw,
      confirmPw,
    });
    setErrors(errors);
    if (!ok) return;

    try {
      setSaving(true);
      await userService.updateMe({ name: name.trim(), email: email.trim() });
      setCtxName(name.trim());
      setInitialName(name.trim());
      setInitialEmail(email.trim());

      if (enablePwChange) {
        await handlePasswordChange();
      }
      Alert.alert("완료", SUCCESS_MESSAGE);
    } catch (error: unknown) {
      const serverError = error as ServerError;
      const errorMessage = getErrorMessage(serverError);
      Alert.alert("오류", errorMessage);
    } finally {
      setSaving(false);
    }
  }, [name, email, enablePwChange, currentPw, newPw, confirmPw, setCtxName, handlePasswordChange, getErrorMessage]);

  // 로그아웃 모달
  const openLogout = useCallback(() => setLogoutModalVisible(true), []);
  const closeLogout = useCallback(() => setLogoutModalVisible(false), []);

  const confirmLogout = useCallback(async () => {
    try {
      // 실제 사용 중인 키 전부 정리
      await SecureStore.deleteItemAsync("auth_tokens");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("user");
      setLogoutModalVisible(false);
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  }, []);

  const confirmDelete = useCallback(() => {
    Alert.alert("계정 탈퇴", "정말로 계정을 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "탈퇴", style: "destructive", onPress: () => {} },
    ]);
  }, []);

  return {
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
    computed: {
      isDirty,
    },
    actions: {
      handleSave,
      openLogout,
      closeLogout,
      confirmLogout,
      confirmDelete,
    },
  };
};
