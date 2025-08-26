import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";

type LoginFormProps = {
  email: string;
  password: string;
  secure: boolean;
  loading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onToggleSecure: () => void;
  onLogin: () => void;
  onSignup: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  secure,
  loading,
  onEmailChange,
  onPasswordChange,
  onToggleSecure,
  onLogin,
  onSignup,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subText}>팀cc맞춤형 플랫폼</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholderTextColor="#ccc"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="비밀번호"
          secureTextEntry={secure}
          value={password}
          onChangeText={onPasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={onToggleSecure} style={styles.eyeButton}>
          <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.linkRow}>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={onSignup}>
          <Text style={styles.link}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <SubmitButton
        title="로그인하기"
        onPress={onLogin}
        buttonColor="#FF9898"
        shadowColor="#E08B8B"
        textColor="#fff"
        width={350}
        height={56}
        style={{ marginTop: 5 }}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  subText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
    fontFamily: "Ongeulip",
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: "Ongeulip",
  },
  eyeButton: {
    padding: 16,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  separator: {
    fontSize: 16,
    color: "#ccc",
    marginHorizontal: 8,
  },
  link: {
    fontSize: 16,
    color: "#FF9898",
    textDecorationLine: "underline",
  },
});
