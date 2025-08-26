import React, { useContext } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { TeamContext } from "../screens/TeamContext";
import styles from "../styles/QuestionScreenStyles";
import { questions } from "./Question";
import { useSurveyProgress } from "../hooks/useSurveyProgress";
import { QuestionContent } from "../component/QuestionContent";
import { QuestionNavigation } from "../component/QuestionNavigation";

// QuestionScreen.tsx
type Props = NativeStackScreenProps<RootStackParamList, "QuestionScreen">;
export default function QuestionScreen({ route, navigation }: Props) {
  const { index, mbti } = route.params;
  const initialAnswers = route.params.answers ?? [];
  const { teamId } = useContext(TeamContext);
  const current = questions[index];

  if (!teamId) return null;

  const {
    selected,
    setSelected,
    goToPrevious,
    goToNext,
    canGoNext,
    canGoPrevious,
  } = useSurveyProgress({
    index,
    mbti,
    initialAnswers,
    navigation,
    teamId,
  });

  return (
    <View style={styles.container}>
      <QuestionContent index={index} question={current.question} onSelect={setSelected} />
      <QuestionNavigation
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
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
