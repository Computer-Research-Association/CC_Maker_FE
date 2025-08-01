import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { questions } from "./Question";
import { TeamContext } from "../screens/TeamContext";
import LikertScale from "../function/LikertScale"; // Likert 컴포넌트 불러오기
import SubmitButton from "../component/SubmitButton";
import HomeScreen from "./HomeScreen";
import api from "../api/apiClient";
import styles from "../styles/QuestionScreenStyles";

// QuestionScreen.tsx
type Props = NativeStackScreenProps<RootStackParamList, "QuestionScreen">;
export default function QuestionScreen({ route, navigation }: Props) {
  const { index, mbti } = route.params;
  // answers가 없을 경우 빈 배열로 초기화
  const initialAnswers = route.params.answers ?? [];
  const [localAnswers, setLocalAnswers] = useState<number[]>(initialAnswers);

  const { teamId } = useContext(TeamContext);
  const current = questions[index];

  if (!teamId) {
    // teamId가 null일 때 처리할 로직 (예: 로딩 화면 표시, 에러 처리 등)
    return null; // 또는 적절한 UI 렌더링
  }
  const [selected, setSelected] = useState<number | null>(null);
  const goToPrevious = () => {
    if (index > 0) {
      navigation.replace("QuestionScreen", {
        index: index - 1,
        mbti,
        answers: localAnswers,
      });
    }
  };

  const goToNext = async () => {
    if (selected === null) return;

    const updatedAnswers = [...localAnswers, selected];
    setLocalAnswers(updatedAnswers); // 상태 업데이트

    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      navigation.push("QuestionScreen", {
        index: nextIndex,
        mbti,
        answers: updatedAnswers,
      });
    } else {
      await completeSurvey(updatedAnswers);
      alert("모든 질문이 끝났습니다!");
      // navigation.reset({
      //   routes: [{ name: "HomeScreen", params: { teamId } }],
      // });
      navigation.navigate("HomeScreen", { teamId });
    }
  };

  const completeSurvey = async (answersToSend: number[]) => {
    try {
      // questionId와 score 매핑
      const answerDtos = answersToSend.map((score, idx) => ({
        questionId: questions[idx].id, // 질문 id 추가
        score: score + 1,
      }));

      //설문조사 완료 api
      await api.post("/api/team/survey/complete", {
        teamId,
      });
      console.log("내가 1번쨰 보낸거");

      //설문조사 결과 api보내기
      await api.post("/api/matching/answer", {
        teamId,
        mbti,
        answers: answerDtos,
      });

      console.log("내가 2번째 보낸거", { teamId, mbti, answers: answerDtos });
    } catch (error) {
      console.error("설문 완료 처리 실패", error);
      alert("설문 완료 처리에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <Text style={styles.title}>질문 {index + 1}</Text>
        <Text style={styles.questionText}>{current.question}</Text>
        <LikertScale question={current.question} onSelect={setSelected} />
      </View>

      <View style={styles.buttonRow}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          {index > 0 && (
            <SubmitButton
              title="이전"
              buttonColor="#bbb"
              shadowColor="#aaa"
              onPress={goToPrevious}
              disabled={false}
              style={{ width: 150 }}
            />
          )}
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <SubmitButton
            title="다음"
            onPress={goToNext}
            disabled={selected === null}
            buttonColor="#FF9898"
            shadowColor="#E08B8B"
            style={{ width: 150 }}
          />
        </View>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 24,
//     paddingTop: 280,
//     paddingBottom: 24,
//   },
//   contentArea: {
//     flex: 1,
//     justifyContent: "flex-start",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   questionText: {
//     fontSize: 18,
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "auto",
//     paddingHorizontal: 2, // 좌우 여백
//     marginBottom: 40,
//   },
// });
