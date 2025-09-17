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
  Image,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "./TeamContext";
import api from "../api/apiClient";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedProgressBar from "../component/AnimatedProgressBar";
import styles from "../styles/HomeScreenStyles";
import { Modal } from "react-native-paper";
// @ts-ignore
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

// min : 100 제한, round: 소수점이하를 반올림하기.s
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
// 해당 팀에서 내가 속한 소그룹ID
  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

  const fetchSubGroupIdIfNeeded = useCallback(async () => {
    if (!teamId || !userId || subGroupId) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/matching/subgroup/${teamId}`, {
        //인자인 객체의 속성값으로 들어감.
        params: { userId },
      });
      //유효한값 날아기지않게 null로 처리
      const newSubGroupId = response.data.subGroupId ?? null;

      setSubGroupIdMap((prev) => {
        //prev = 이전 값 상태 
        if (prev[teamId] === newSubGroupId) return prev;
        //같으면 걍 그대로 두고 다르면 새로운 값으로 업데이트
        return { ...prev, [teamId]: newSubGroupId };
      });

      console.log("✅ HomeScreen: subGroupId 업데이트 완료:", newSubGroupId);
    } catch (error) {
      console.error("subGroupId 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId, userId, subGroupId, setSubGroupIdMap]);
  //서브 그룹 점수판불러오기(첫진입시)
  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;

    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        console.log("✅ Scoreboard API 응답:", res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        setScoreboard(null);
      });
  }, [teamId, userId]);
  //화면 진입시 자동적인 실행, API호출
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!teamId || !userId) return;

        // subGroupId가 없으면 먼저 가져오기
        if (!subGroupId) {
          await fetchSubGroupIdIfNeeded();
        }

        // scoreboard 가져오기
        fetchScoreboard();
      };
      loadData();
    }, [teamId, userId, subGroupId, fetchSubGroupIdIfNeeded, fetchScoreboard])
  );
  ///로딩,에러, 데이터없음 처리
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7f8fa",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
          로딩 중...
        </Text>
      </View>
    );
  }

  //  매칭 여부 체크 (옵셔널 체이닝)
  if (!subGroupId) {
    return (
      <View style={styles.container}>
        <View style={styles.matchingWaitContainer}>
          <View style={styles.matchingIconContainer}>
            <Image
              source={require("../../assets/free-icon-hearts-18745836.png")}
              style={styles.matchingIcon}
            />
          </View>
          <Text style={styles.matchingTitleText}>
            매칭을 먼저 진행해주세요.
          </Text>
          <Text style={styles.matchingSubText}>
            미션을 시작하기 전에 매칭 과정을 완료해야 합니다.
          </Text>
        </View>
      </View>
    );
  }
  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>에러 발생: {error}</Text>
  //     </View>
  //   );
  // }

  if (!scoreboard) {
    return (
      <View style={styles.container}>
        <View style={styles.matchingWaitContainer}>
          <View style={styles.matchingIconContainer}>
            <Image
              source={require("../../assets/free-icon-hearts-18745836.png")}
              style={styles.matchingIcon}
            />
          </View>
          <Text style={styles.matchingTitleText}>
            최소학점을 설정해주세요 
          </Text>
          <Text style={styles.matchingSubText}>
            미션을 시작하기 전에 최소학점을 설정해야 합니다.
          </Text>
        </View>
      </View>
    );
  }

  // 전체 그룹 정렬 및 1등/내 그룹 분리
  const allGroups = [scoreboard.mySubGroup, ...scoreboard.otherSubGroups];
  const sortedGroups = [...allGroups].sort((a, b) => b.score - a.score);
  const topTeam = sortedGroups[0];
  const isMyTeamTop = topTeam.subGroupId === scoreboard.mySubGroup.subGroupId;
  const mySubGroupId = scoreboard.mySubGroup.subGroupId;

  // 1등, 내 그룹, 나머지 그룹 분리
  const restGroups = sortedGroups.slice(1);
  const myGroup = scoreboard.mySubGroup;
  const isMyGroupTop = topTeam.subGroupId === myGroup.subGroupId;

  // 현재 사용자의 서브그룹 상대방 찾기
  const getMyPartner = () => {
    if (!myGroup.members || myGroup.members.length < 2) return null;

    // 현재 사용자 이름 (첫 번째 멤버)
    const currentUser = myGroup.members[0];

    // 상대방들 (첫 번째 멤버 제외)
    const partners = myGroup.members.slice(1);

    if (partners.length === 1) {
      // 2명 그룹: 상대방 1명
      return partners[0];
    } else if (partners.length === 2) {
      // 3명 그룹: 상대방 2명을 "&"로 연결
      return `${partners[0]} & ${partners[1]}`;
    } else if (partners.length === 3) {
      // 4명 그룹: 상대방 3명을 "&"로 연결
      return `${partners[0]} & ${partners[1]} & ${partners[2]}`;
    }

    return null;
  };

  const myPartner = getMyPartner();
  

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f8fa" />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: 32, paddingBottom: 32 },
          ]}
        >
          {/* 상단 왕관 + 내 그룹명 + 하트 + 테스트명 */}
          <View style={styles.groupTitleContainer}>
            <Image
              source={require("../../assets/free-icon-crown-6941697.png")}
              style={{ width: 44, height: 44, marginBottom: 2, marginLeft: 4 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Text style={styles.myNameText}>
                {myGroup.members?.[0] ?? ""}
              </Text>
              <Image
                source={require("../../assets/free-icon-hearts-18745836.png")}
                style={{ width: 18, height: 18, marginHorizontal: 4 }}
              />
              <Text style={styles.myNameText}>
                {myPartner || teamName || "테스트"}
              </Text>
            </View>
          </View>

          {/* 1등 그룹 카드 (항상 맨 위, 빨간색 강조) */}
          <View style={styles.topCardBox}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={styles.topNameText}>
                {topTeam.members?.[0] ?? ""}
              </Text>
              <Image
                source={require("../../assets/free-icon-hearts-18745836.png")}
                style={{ width: 18, height: 18, marginHorizontal: 2 }}
              />
              <Text style={styles.topNameText}>
                {topTeam.members && topTeam.members.length > 1
                  ? topTeam.members.slice(1).join(" & ")
                  : teamName || "테스트"}
              </Text>
            </View>
            <AnimatedProgressBar
              current={topTeam.score}
              max={scoreboard.minScore}
              barHeight={28}
              gradient={["#ffb6d1", "#ffd1e1"]}
              textColor="#888"
              percentColor="#ff5a5a"
              isTopTeam={true}
            />
          </View>

          {/* 1등과 나머지 그룹 구분선 */}
          <View style={styles.divider} />

          {/* 나머지 그룹 카드들 (내 그룹은 파랑 강조) */}
          {restGroups.map((sg) => {
            const isMyTeam = sg.subGroupId === myGroup.subGroupId;
            const isOtherGroup =
              !isMyTeam && sg.subGroupId !== topTeam.subGroupId;
            return (
              <View
                key={sg.subGroupId}
                style={[
                  styles.otherCardBox,
                  isMyTeam && !isMyGroupTop && styles.blueCardBox,
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={
                      isMyTeam && !isMyGroupTop
                        ? styles.blueNameText
                        : styles.otherNameText
                    }
                  >
                    {sg.members?.[0] ?? ""}
                  </Text>
                  <Image
                    source={require("../../assets/free-icon-hearts-18745836.png")}
                    style={{ width: 16, height: 16, marginHorizontal: 2 }}
                  />
                  <Text
                    style={
                      isMyTeam && !isMyGroupTop
                        ? styles.blueNameText
                        : styles.otherNameText
                    }
                  >
                    {sg.members && sg.members.length > 1
                      ? sg.members.slice(1).join(" & ")
                      : teamName || "테스트"}
                  </Text>
                </View>
                <AnimatedProgressBar
                  current={sg.score}
                  max={scoreboard.minScore}
                  barHeight={24}
                  gradient={
                    isMyTeam && !isMyGroupTop
                      ? ["#b6d1ff", "#d1e1ff"]
                      : isOtherGroup
                        ? ["#D2D9E1", "#DDDFE3"] // 다른 그룹: 짙은 회색 그라데이션
                        : undefined
                  }
                  textColor={
                    isMyTeam && !isMyGroupTop
                      ? "#2196f3"
                      : isOtherGroup
                        ? "#888"
                        : undefined
                  }
                  percentColor={
                    isMyTeam && !isMyGroupTop
                      ? "#2196f3"
                      : isOtherGroup
                        ? "#888"
                        : undefined
                  }
                  hideBorder={isOtherGroup || (isMyTeam && !isMyGroupTop)}
                  containerBackgroundColor={
                    isMyTeam && !isMyGroupTop ? "#DBEAFE" : undefined
                  }
                />
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}
