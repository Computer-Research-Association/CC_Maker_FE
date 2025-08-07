import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "./TeamContext";
import api from "../api/apiClient";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedProgressBar from "../component/AnimatedProgressBar";
import styles from "../styles/HomeScreenStyles";
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

const calculatePercent = (score: number, minScore: number) => {
  if (minScore === 0) return 0;
  return Math.min(100, Math.round((score / minScore) * 100));
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  //내가 속한팀ID,ID별 소그룹 ID저장 객체, 소그룹 ID저장 함수,현재 로그인한 사용자ID
  const { teamId, subGroupIdMap, teamName, setSubGroupIdMap } =
    useContext(TeamContext);
  const { userId } = useContext(UserContext);
  //서버에서 받아온 팀 점수데이터, 데이터를 불러오는 중인지 여부, 에러 발생시 에러메시지 저장
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    if (!teamId || !userId || !subGroupId) return;

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

  //서브 그룹 ID불러오기(첫진입시)
  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;

    setLoading(true);
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        console.log("✅ Scoreboard API 응답:", res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        console.log("✅ Scoreboard API 응답:");
        setScoreboard(null);
      })
      .finally(() => setLoading(false));
  }, [teamId, userId]);
  //화면 진입시 자동적인 실행, API호출
  useFocusEffect(
    useCallback(() => {
      fetchSubGroupIdIfNeeded().then(fetchScoreboard);
    }, [fetchSubGroupIdIfNeeded, fetchScoreboard])
  );
  ///로딩,에러, 데이터없음 처리
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!subGroupId) {
    return (
      <View style={styles.container}>
        <Text style={styles.matchingMessage}>매칭을 설정해주세요</Text>
      </View>
    );
  }

  if (!scoreboard) {
    return (
      <View style={styles.container}>
        <Text style={styles.matchingMessage}>최소학점을 설정해주세요</Text>
      </View>
    );
  }

  // ✅ 전체 그룹 정렬 및 1등/내 그룹 분리
  const allGroups = [scoreboard.mySubGroup, ...scoreboard.otherSubGroups];
  const sortedGroups = [...allGroups].sort((a, b) => b.score - a.score);
  const topTeam = scoreboard!.mySubGroup;
  const isMyTeamTop = topTeam.subGroupId === scoreboard.mySubGroup.subGroupId;
  const mySubGroupId = scoreboard.mySubGroup.subGroupId;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView contentContainerStyle={styles.container}>
          {/* ✅ 왕관 + 내 그룹 멤버 표시 */}
          <View style={styles.groupTitleContainer}>
            <Text style={styles.crown}>👑</Text>
            <Text
              style={styles.teamNameText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7} // 너무 작아지는 것 방지
            >
              {topTeam.members?.join(" ❣️ ") ?? "멤버 없음"}
            </Text>
          </View>

          {/* ✅ 1등 그룹 카드 */}
          <View style={[styles.progressCard, styles.topTeamCard]}>
            {/* <Text style={styles.subtitle}>🥇</Text> */}
            <Text style={styles.cardTitle}>
              {topTeam.members?.join(" 😉 ") ?? "멤버 없음"}
            </Text>
            <AnimatedProgressBar
              current={topTeam.score}
              max={
                typeof scoreboard.minScore === "number"
                  ? scoreboard.minScore
                  : 0
              }
              barHeight={30}
            />
          </View>
          <View style={styles.divider} />

          {/* ✅ 나머지 그룹들 (점수순 + 내 그룹 강조) */}
          <View style={styles.section}>
            {sortedGroups
              .filter((sg) => sg.subGroupId !== topTeam.subGroupId)
              .map((sg) => {
                const isMyTeam = sg.subGroupId === mySubGroupId;
                return (
                  <View
                    key={sg.subGroupId}
                    style={[styles.progressCard, isMyTeam && styles.myCard]}
                  >
                    <Text style={styles.cardTitle}>
                      {sg.members?.join(" ⭐ ") ?? "멤버 없음"}
                    </Text>
                    <AnimatedProgressBar
                      current={sg.score}
                      max={
                        typeof scoreboard.minScore === "number"
                          ? scoreboard.minScore
                          : 0
                      }
                      barHeight={25}
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 80,
//     paddingTop: 20,
//     backgroundColor: "#fff",
//   },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
//   section: { marginBottom: 30, width: "100%" },
//   subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
//   teamNameText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   groupTitleContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   crown: {
//     fontSize: 48,
//     color: "#FFD700",
//     marginBottom: 4,
//   },
//   progressCard: {
//     width: "100%",
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   myCard: {
//     backgroundColor: "#F0F8FF",
//     borderColor: "#007AFF",
//     borderWidth: 1,
//   },
//   topTeamCard: {
//     backgroundColor: "#FFE3E1",
//     borderColor: "#FF9494",
//     borderWidth: 1.5,
//   },
//   cardTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#333",
//   },
//   divider: {
//     width: "100%",
//     height: 1,
//     backgroundColor: "#ccc",
//     marginVertical: 16, // 위아래 간격 조절
//   },
// });
