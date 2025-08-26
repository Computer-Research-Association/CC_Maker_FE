import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

type TeamCreationFormProps = {
  teamName: string;
  onTeamNameChange: (text: string) => void;
  onCreateTeam: () => void;
};

export const TeamCreationForm: React.FC<TeamCreationFormProps> = ({
  teamName,
  onTeamNameChange,
  onCreateTeam,
}) => {
  return (
    <>
      <Text style={styles.title}>팀이름을 입력해주세요</Text>
      <Text style={styles.subtitle}>깔쌈하게 만들어주세요</Text>

      <TextInput
        style={styles.input}
        placeholder="팀명"
        value={teamName}
        onChangeText={onTeamNameChange}
        placeholderTextColor="#ccc"
      />

      <SubmitButton
        onPress={onCreateTeam}
        title="팀 생성하기"
        buttonColor="#FFFFFF"
        shadowColor="#ddd"
        textColor="#808080"
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
  },
});
