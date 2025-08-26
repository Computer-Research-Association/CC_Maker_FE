import React from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { ItemType } from "react-native-dropdown-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import DropDownPicker from "react-native-dropdown-picker";
import { login, signup } from "../api/authApi"; // api 함수 import
import styles from "../styles/SignupScreen.styles";
import LoginScreen from "./LoginScreen";
import { useSignupForm } from "../hooks/useSignupForm";
import { usePrivacyAgreement } from "../hooks/usePrivacyAgreement";
import { NameInput } from "../component/signup/NameInput";
import { BirthDateInputs } from "../component/signup/BirthDateInputs";
import { EmailInput } from "../component/signup/EmailInput";
import { PasswordInputs } from "../component/signup/PasswordInputs";
import { GenderSelector } from "../component/signup/GenderSelector";
import { PrivacyAgreementSection } from "../component/signup/PrivacyAgreementSection";

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

//모듈 외부로 넘기기, 이름은 자유로 설정 가능, 함수형(네비로 화면 이동 가능)
export default function SignupScreen({ navigation }: SignupScreenProps) {
  const form = useSignupForm(navigation);
  const privacy = usePrivacyAgreement();

  // form.validateFullDate 사용

  const {
    name,
    birthYear,
    birthMonth,
    birthDay,
    birthError,
    emailId,
    emailDomain,
    emailError,
    open,
    domainItems,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    gender,
    setName,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    setBirthError,
    setEmailId,
    setEmailDomain,
    setEmailError,
    setOpen,
    setDomainItems,
    setPassword,
    setPasswordError,
    setConfirmPassword,
    setConfirmPasswordError,
    setGender,
    onlyNumber,
    validateFullDate,
    validateEmailId,
    getPasswordErrorMessage,
    handleSignup,
  } = form;

  // async 비동기 함수시작
  const onSubmit = () => handleSignup(privacy.privacyAgreed, privacy.privacyVersion, privacy.setPrivacyError);

  // form.onlyNumber 사용

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <Text style={styles.title}>회원가입</Text>

      <NameInput value={name} onChangeText={setName} />

      <BirthDateInputs
        year={birthYear}
        month={birthMonth}
        day={birthDay}
        error={birthError}
        onChangeYear={(t: string) => { const v = onlyNumber(t); setBirthYear(v); validateFullDate(v, birthMonth, birthDay); }}
        onChangeMonth={(t: string) => { const v = onlyNumber(t); setBirthMonth(v); validateFullDate(birthYear, v, birthDay); }}
        onChangeDay={(t: string) => { const v = onlyNumber(t); setBirthDay(v); validateFullDate(birthYear, birthMonth, v); }}
      />

      <View style={{ marginBottom: 10, marginVertical: -20 }}>
        <Text
          style={{ color: birthError ? "red" : "transparent", fontSize: 12 }}
        >
          {birthError || "올바른 생년월일을 입력하세요."}
        </Text>
      </View>

      <EmailInput
        emailId={emailId}
        emailDomain={emailDomain}
        open={open}
        domainItems={domainItems}
        emailError={emailError}
        setEmailId={(t: string) => { setEmailId(t); validateEmailId(t); }}
        setEmailDomain={setEmailDomain}
        setOpen={setOpen}
        setDomainItems={setDomainItems}
      />
      {emailError ? (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            marginTop: -15,
            marginBottom: 10,
          }}
        >
          {emailError}
        </Text>
      ) : null}

      <PasswordInputs
        password={password}
        passwordError={passwordError}
        confirmPassword={confirmPassword}
        confirmPasswordError={confirmPasswordError}
        onChangePassword={(t: string) => { setPassword(t); setPasswordError(getPasswordErrorMessage(t)); }}
        onChangeConfirmPassword={(t: string) => { setConfirmPassword(t); setConfirmPasswordError(t !== password ? "비밀번호가 일치하지 않습니다." : ""); }}
      />

      <GenderSelector gender={gender} onChange={setGender} />

      <PrivacyAgreementSection
        privacyExpanded={privacy.privacyExpanded}
        onToggleExpanded={privacy.togglePrivacyExpanded}
        isLoadingPrivacy={privacy.isLoadingPrivacy}
        privacyContent={privacy.privacyContent}
        privacyAgreed={privacy.privacyAgreed}
        onToggleAgreed={privacy.togglePrivacyAgreement}
        privacyError={privacy.privacyError}
      />

      <TouchableOpacity style={styles.roundButton} onPress={onSubmit}>
        <Text style={styles.roundButtonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
