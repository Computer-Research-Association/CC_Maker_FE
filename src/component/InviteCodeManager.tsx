import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";

type InviteCodeManagerProps = {
  teamCode: string;
  loading: boolean;
  onGenerateCode: () => void;
  onCopyCode: () => void;
  onStart: () => void;
};

export const InviteCodeManager: React.FC<InviteCodeManagerProps> = ({
  teamCode,
  loading,
  onGenerateCode,
  onCopyCode,
  onStart,
}) => {
  return (
    <>
      <SubmitButton
        title="팀코드 생성하기"
        buttonColor="#FFFFFF"
        shadowColor="#ddd"
        onPress={onGenerateCode}
        disabled={loading}
        textColor="#808080"
      >
        <Text style={styles.buttonText}>
          {loading ? "생성 중..." : "팀 코드 생성"}
        </Text>
      </SubmitButton>

      {teamCode !== "" && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>생성된 팀 코드: {teamCode}</Text>
          
          <SubmitButton
            title="코드복사하기"
            buttonColor="#FF9898"
            shadowColor="#E08B8B"
            onPress={onCopyCode}
          />

          <SubmitButton
            title="시작하기"
            buttonColor="#FF9898"
            shadowColor="#E08B8B"
            onPress={onStart}
          >
            <Text style={styles.startButtonText}>시작하기</Text>
          </SubmitButton>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#808080",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
