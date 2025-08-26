import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

type TeamJoinFormProps = {
  code: string;
  onCodeChange: (text: string) => void;
  onJoinTeam: () => void;
  loading: boolean;
};

export const TeamJoinForm: React.FC<TeamJoinFormProps> = ({
  code,
  onCodeChange,
  onJoinTeam,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>초대 코드로 팀 가입</Text>
      
      <TextInput
        placeholder="초대코드를 입력하세요"
        value={code}
        onChangeText={onCodeChange}
        style={styles.input}
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <SubmitButton
        onPress={onJoinTeam}
        title="팀 가입하기"
        buttonColor="#FF9898"
        shadowColor="#E08B8B"
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "가입 중..." : "팀 가입하기"}
        </Text>
      </SubmitButton>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    width: "100%",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
