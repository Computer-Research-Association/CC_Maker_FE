import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../styles/HomeScreenStyles";

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
