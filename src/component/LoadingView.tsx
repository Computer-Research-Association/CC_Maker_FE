import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

type LoadingViewProps = {
  message?: string;
};

export const LoadingView: React.FC<LoadingViewProps> = ({ 
  message = "로딩 중..." 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ff6b6b" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
