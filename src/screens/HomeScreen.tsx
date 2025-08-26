import React, { useContext } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeamContext } from "./TeamContext";
import { UserContext } from "./UserContext";
import styles from "../styles/HomeScreenStyles";
import { useHomeScreen } from "../hooks/useHomeScreen";
import { GroupTitle } from "../component/GroupTitle";
import { ScoreCard } from "../component/ScoreCard";
import { LoadingView } from "../component/LoadingView";
import { MatchingWaitView } from "../component/MatchingWaitView";
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
  const { teamId, subGroupIdMap, teamName, setSubGroupIdMap } = useContext(TeamContext);
  const { userId } = useContext(UserContext);
  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

  const {
    state: { scoreboard, loading, error },
    computed: { isLoading: isLoadingComputed },
  } = useHomeScreen({ teamId, userId, subGroupId, setSubGroupIdMap });
  ///로딩,에러, 데이터없음 처리
  if (loading || isLoadingComputed) {
    return <LoadingView />;
  }

  //  매칭 여부 체크 (옵셔널 체이닝)
  if (!subGroupId) {
    return (
      <MatchingWaitView
        title="매칭을 먼저 진행해주세요."
        subtitle="미션을 시작하기 전에 매칭 과정을 완료해야 합니다."
      />
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
      <MatchingWaitView
        title="최소학점을 설정해주세요"
        subtitle="미션을 시작하기 전에 최소학점을 설정해야 합니다."
      />
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
          <GroupTitle myName={myGroup.members?.[0] ?? ""} myPartner={myPartner} teamName={teamName} />

          <ScoreCard group={topTeam} minScore={scoreboard.minScore} isTopTeam />

          {/* 1등과 나머지 그룹 구분선 */}
          <View style={styles.divider} />

          {/* 나머지 그룹 카드들 (내 그룹은 파랑 강조) */}
          {restGroups.map((sg) => (
            <ScoreCard
              key={sg.subGroupId}
              group={sg}
              minScore={scoreboard.minScore}
              isMyTeam={sg.subGroupId === myGroup.subGroupId && !isMyGroupTop}
              teamName={teamName}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}
