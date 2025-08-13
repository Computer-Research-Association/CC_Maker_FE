import api from './apiClient';

// 미션 히스토리 조회 (팀별)
export async function getMissionHistoryByUser(userId: number, teamId: number) {
  try {
    console.log('미션 히스토리 조회 요청:', userId, teamId);
    const response = await api.get(`/api/mission/history/user/${userId}`, {
      params: { teamId }
    });
    console.log('미션 히스토리 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('미션 히스토리 조회 실패:', error);
    console.error('오류 상태:', error.response?.status);
    console.error('오류 데이터:', error.response?.data);
    throw error;
  }
}

// 서브그룹별 미션 히스토리 조회
export async function getMissionHistoryBySubGroup(subGroupId: number) {
  try {
    const response = await api.get(`/api/mission/history/subgroup/${subGroupId}`);
    return response.data;
  } catch (error: any) {
    console.error('서브그룹 미션 히스토리 조회 실패:', error);
    throw error;
  }
}

// 팀별 미션 히스토리 조회
export async function getMissionHistoryByTeam(teamId: number) {
  try {
    const response = await api.get(`/api/mission/history/team/${teamId}`);
    return response.data;
  } catch (error: any) {
    console.error('팀 미션 히스토리 조회 실패:', error);
    throw error;
  }
}
