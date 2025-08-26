import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LabeledInput } from "./LabledInput";

//비밀번호 구역만 담당
interface Props {
  enable: boolean;
  setEnable: (v: boolean) => void;
  currentPw: string;
  setCurrentPw: (v: string) => void;
  newPw: string;
  setNewPw: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  error?: string;
}

export const PasswordSection: React.FC<Props> = ({
  enable,
  setEnable,
  currentPw,
  setCurrentPw,
  newPw,
  setNewPw,
  confirmPw,
  setConfirmPw,
  error,
}) => {
  return (
    <View>
      <TouchableOpacity
        style={ps.toggleRow}
        onPress={() => setEnable(!enable)}
        activeOpacity={0.8}
      >
        <Text style={ps.sectionTitle}>비밀번호 변경</Text>
        <Text style={ps.toggleText}>{enable ? "숨기기 ▲" : "펼치기 ▼"}</Text>
      </TouchableOpacity>

      {enable && (
        <View style={ps.card}>
          <LabeledInput
            label="현재 비밀번호"
            value={currentPw}
            onChangeText={setCurrentPw}
            secureTextEntry
            placeholder="현재 비밀번호를 입력해주세요."
          />
          <LabeledInput
            label="새 비밀번호"
            value={newPw}
            onChangeText={setNewPw}
            secureTextEntry
            placeholder="새 비밀번호를 입력해주세요. (8자 이상)"
          />
          <LabeledInput
            label="새 비밀번호 확인"
            value={confirmPw}
            onChangeText={setConfirmPw}
            secureTextEntry
            placeholder="새 비밀번호를 다시 입력해주세요."
            error={error}
          />
        </View>
      )}
    </View>
  );
};

const ps = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Ongeulip",
    marginTop: 16,
    marginBottom: 8,
  },
  toggleRow: {
    marginTop: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 36,
  },
  toggleText: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Ongeulip",
    lineHeight: 18,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    overflow: "visible",
  },
});
