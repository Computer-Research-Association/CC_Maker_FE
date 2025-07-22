import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "./TeamContext";
import api from "../api/apiClient";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedProgressBar from "../component/AnimatedProgressBar";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "HomeScreen">;
};

type SubGroupScore = {
  subGroupId: number;
  name: string;
  score: number;
  members: string[];
};

type ScoreboardResponse = {
  minScore: number;
  mySubGroup: SubGroupScore;
  otherSubGroups: SubGroupScore[];
};

// ✅ 백분율 계산 함수 추가
const calculatePercent = (score: number, minScore: number) => {
  if (minScore === 0) return 0;
  return Math.min(100, Math.round((score / minScore) * 100));
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { teamId, subGroupIdMap, teamName, setSubGroupIdMap } =
    useContext(TeamContext);
  const { userId } = useContext(UserContext);
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    if (!teamId || !userId || subGroupId) return;

    try {
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        params: { userId },
      });
      const newSubGroupId = response.data.subGroupId ?? null;

      setSubGroupIdMap((prev) => {
        if (prev[teamId] === newSubGroupId) return prev;
        return { ...prev, [teamId]: newSubGroupId };
      });

      console.log("✅ HomeScreen: subGroupId 업데이트 완료:", newSubGroupId);
    } catch (error) {
      console.error("subGroupId 조회 실패:", error);
    }
  }, [teamId, userId, subGroupId, setSubGroupIdMap]);

  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;

    setLoading(true);
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        console.log("✅ Scoreboard API 응답:", res.data); // 여기에 콘솔 찍기
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        setScoreboard(null);
      })
      .finally(() => setLoading(false));
  }, [teamId, userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSubGroupIdIfNeeded().then(fetchScoreboard);
    }, [fetchSubGroupIdIfNeeded, fetchScoreboard])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>에러 발생: {error}</Text>
      </View>
    );
  }

  if (!scoreboard) {
    return (
      <View style={styles.container}>
        <Text>데이터가 없습니다.</Text>
      </View>
    );
  }

  const sortedOtherSubGroups = scoreboard.otherSubGroups
    .filter((sg) => sg.subGroupId !== scoreboard.mySubGroup.subGroupId) // ✅ 내 그룹 제외
    .sort((a, b) => b.score - a.score); // 점수순 정렬

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ 팀 이름 표시 */}
        <View style={styles.groupTitleContainer}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.teamNameText}>
            {scoreboard.mySubGroup.members?.join(", ") ?? "멤버 없음"}
          </Text>
        </View>

        <Text style={styles.title}>팀 최소 학점: {scoreboard.minScore}</Text>

        <View style={{ marginBottom: 30, width: "100%" }}>
          {/* ✅ 내 서브그룹 백분율 포함 */}
          <AnimatedProgressBar
            current={scoreboard.mySubGroup.score}
            max={scoreboard.minScore}
            // label={`${scoreboard.mySubGroup.members.join(", ")} (${calculatePercent(scoreboard.mySubGroup.score, scoreboard.minScore)}%)`}
            label={`${
              scoreboard.mySubGroup.members?.join(", ") ?? "멤버 없음"
            } (${calculatePercent(
              scoreboard.mySubGroup.score,
              scoreboard.minScore
            )}%)`}
          />
        </View>

        <View style={styles.section}>
          {sortedOtherSubGroups.map((sg) => (
            <View key={sg.subGroupId} style={{ marginBottom: 20 }}>
              <AnimatedProgressBar
                current={sg.score}
                max={scoreboard.minScore}
                label={`${
                  sg.members?.join(", ") ?? "멤버 없음"
                } (${calculatePercent(sg.score, scoreboard.minScore)}%)`}
                barHeight={25} // ✅ 다른 애들은 얇게
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // ⭐ ScrollView에서 전체 영역 채움
    justifyContent: "flex-start", // ⭐ 위에서부터 정렬
    alignItems: "center",
    padding: 20,
    paddingBottom: 80, // ⭐ 하단 safe 영역 확보
    paddingTop: 60,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 30, width: "100%" },
  subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  members: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  teamNameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  groupTitleContainer: {
    alignItems: "center", // 수직 가운데 정렬
    marginBottom: 20, // 아래 여백
  },
  crown: {
    fontSize: 48, // 크게!
    color: "#FFD700", // 금색 왕관 느낌
    marginBottom: 4, // 왕관 아래 살짝 간격
  },
});
