import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { joinTeamByCode } from "../api/teamApi";
import styles from "../styles/StartScreenStyles";

type StartScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "StartScreen">;
};

export default function StartScreen({ navigation }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>준비가 완료되었습니다!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 160,
//     paddingHorizontal: 24,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 12,
//     color: "#111",
//     marginTop: 50,
//   },
//   input: {
//     backgroundColor: "#f7f8fa",
//     borderRadius: 16,
//     height: 52,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: "#333",
//     marginTop: 100,
//   },
//   button: {
//     backgroundColor: "#FF9898",
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 350,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
