// src/api/teamApi.ts
import api from './apiClient';

// 초대코드를 사용해 팀에 가입하는 함수
export async function joinTeamByCode(code: string): Promise<void> {
  try{
    await api.post('/api/invite/join', { code });
    // 성공 시 특별한 리턴 없음
  }catch (error: any) {
    console.error('팀 가입 오류:', error);
    const message = error.response?.data?.message || '팀 가입 중 오류 발생';
    throw new Error(message);
  }
}
