// 미션 히스토리 타입
export interface MissionHistory {
  id: number;
  subGroupId: number;
  subGroupName?: string;
  userId: number;
  userName: string;
  matchedNames?: string[]; // 매칭된 상대방들의 이름
  missionTemplateId: number;
  missionTitle: string;
  missionDescription: string;
  missionScore: number;
  completedAt: string;
  createdAt: string;
}

// 기존 미션 타입들 (필요시)
export interface Mission {
  id: number;
  title: string;
  description: string;
  score: number;
  isCompleted: boolean;
}
