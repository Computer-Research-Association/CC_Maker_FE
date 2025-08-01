import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AccountSettings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정 설정</Text>
      {/* 여기서 이메일, 비밀번호 변경, 로그아웃 버튼 등 추가 */}
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
