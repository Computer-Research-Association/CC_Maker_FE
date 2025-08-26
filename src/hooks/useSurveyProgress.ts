import { useState, useCallback } from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { questions } from "../screens/Question";
import api from "../api/apiClient";

type UseSurveyProgressProps = {
  index: number;
  mbti: string;
  initialAnswers: number[];
  navigation: NativeStackNavigationProp<RootStackParamList, "QuestionScreen">;
  teamId: number;
};

export const useSurveyProgress = ({
  index,
  mbti,
  initialAnswers,
  navigation,
  teamId
}: UseSurveyProgressProps) => {
  const [localAnswers, setLocalAnswers] = useState<number[]>(initialAnswers);
  const [selected, setSelected] = useState<number | null>(null);

  const goToPrevious = useCallback(() => {
    if (index > 0) {
      navigation.replace("QuestionScreen", {
        index: index - 1,
        mbti,
        answers: localAnswers,
      });
    }
  }, [index, mbti, localAnswers, navigation]);

  const goToNext = useCallback(async () => {
    if (selected === null) return;

    const updatedAnswers = [...localAnswers, selected];
    setLocalAnswers(updatedAnswers);

    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      navigation.push("QuestionScreen", {
        index: nextIndex,
        mbti,
        answers: updatedAnswers,
      });
    } else {
      // 설문 완료 처리
      await completeSurvey(updatedAnswers);
      alert("모든 질문이 끝났습니다!");
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen", params: { teamId } }],
      });
    }
  }, [selected, localAnswers, index, mbti, navigation, teamId]);

  const completeSurvey = useCallback(async (answersToSend: number[]) => {
    try {
      // questionId와 score 매핑
      const answerDtos = answersToSend.map((score, idx) => ({
        questionId: questions[idx].id,
        score: score + 1,
      }));

      // 설문조사 완료 api
      await api.post("/api/team/survey/complete", {
        teamId,
      });
      console.log("내가 1번쨰 보낸거");

      // 설문조사 결과 api보내기
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
  }, [teamId, mbti]);

  return {
    localAnswers,
    selected,
    setSelected,
    goToPrevious,
    goToNext,
    canGoNext: selected !== null,
    canGoPrevious: index > 0
  };
};
