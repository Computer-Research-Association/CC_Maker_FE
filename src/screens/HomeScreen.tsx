import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "./TeamContext";
import api from "../api/apiClient";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "HomeScreen">;
};

type SubGroupScore = {
  subGroupId: number;
  name: string;
  score: number;
};

type ScoreboardResponse = {
  minScore: number;
  mySubGroup: SubGroupScore;
  otherSubGroups: SubGroupScore[];
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { teamId } = useContext(TeamContext);
  const { userId } = useContext(UserContext);
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;

    setLoading(true);
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
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
      fetchScoreboard();
    }, [fetchScoreboard])
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>팀 최소 학점: {scoreboard.minScore}</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>
          내 서브그룹 ({scoreboard.mySubGroup.name}) 점수: {scoreboard.mySubGroup.score}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>다른 서브그룹 점수</Text>
        {scoreboard.otherSubGroups.map((sg) => (
          <Text key={sg.subGroupId} style={styles.subGroupText}>
            {sg.name}: {sg.score}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 30, width: "100%" },
  subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  subGroupText: { fontSize: 14, marginVertical: 4 },
});
