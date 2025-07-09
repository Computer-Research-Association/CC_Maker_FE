import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { questions } from "./Question";
import LikertScale from "../function/LikertScale"; // Likert 컴포넌트 불러오기
import SubmitButton from "../component/SubmitButton";
import HomeScreen from "./HomeScreen";
type Props = NativeStackScreenProps<RootStackParamList, "QuestionScreen">;

export default function QuestionScreen({ route, navigation }: Props) {
  const { index } = route.params;
  const current = questions[index];

  const [selected, setSelected] = useState<number | null>(null);
  const goToPrevious = () => {
    if (index > 0) {
      navigation.replace("QuestionScreen", { index: index - 1 });
    }
  };

  const goToNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      navigation.push("QuestionScreen", { index: nextIndex });
    } else {
      alert("모든 질문이 끝났습니다!");
      navigation.navigate("MypageScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>질문 {index + 1}</Text>
      <Text style={styles.questionText}>{current.question}</Text>

      <LikertScale question={current.question} onSelect={setSelected} />

      <SubmitButton
        title="다음"
        onPress={goToNext}
        disabled={selected === null}
      />
      {index > 0 && (
        <SubmitButton title="이전" onPress={goToPrevious} disabled={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  questionText: { fontSize: 18, textAlign: "center", marginBottom: 24 },
  button: {
    backgroundColor: "#FF9898",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 32,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
