// 타입 정의
export type SubGroupScore = {
  subGroupId: number;
  name: string;
  score: number;
  members: string[];
};

export type ScoreboardResponse = {
  minScore: number;
  mySubGroup: SubGroupScore;
  otherSubGroups: SubGroupScore[];
};

// min : 100 제한, round: 소수점이하를 반올림
export const calculatePercent = (score: number, minScore: number) => {
  if (minScore === 0) return 0;
  return Math.min(100, Math.round((score / minScore) * 100));
};

// 전체 그룹 정렬 및 1등/내 그룹 분리
export const processScoreboardData = (scoreboard: ScoreboardResponse) => {
  const allGroups = [scoreboard.mySubGroup, ...scoreboard.otherSubGroups];
  const sortedGroups = [...allGroups].sort((a, b) => b.score - a.score);
  const topTeam = sortedGroups[0];
  const isMyTeamTop = topTeam.subGroupId === scoreboard.mySubGroup.subGroupId;
  const mySubGroupId = scoreboard.mySubGroup.subGroupId;

  // 1등, 내 그룹, 나머지 그룹 분리
  const restGroups = sortedGroups.slice(1);
  const myGroup = scoreboard.mySubGroup;
  const isMyGroupTop = topTeam.subGroupId === myGroup.subGroupId;

  return {
    allGroups,
    sortedGroups,
    topTeam,
    isMyTeamTop,
    mySubGroupId,
    restGroups,
    myGroup,
    isMyGroupTop,
  };
};

// 현재 사용자의 서브그룹 상대방 찾기
export const getMyPartner = (myGroup: SubGroupScore) => {
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
