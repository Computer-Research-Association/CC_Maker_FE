
// services/MatchingService.ts
import api from "../api/apiClient";

export class MatchingService {
  static async getSubGroupId(teamId: number, userId: number): Promise<number | null> {
    const response = await api.get(`/api/matching/subgroup/${teamId}`, {
      params: { userId },
    });
    return response.data.subGroupId ?? null;
  }

  static async getSurveyStatus(teamId: number) {
    return api.get(`/api/team/${teamId}/survey-status/all`);
  }

  static async getTeam(teamId: number) {
    return api.get(`/api/team/${teamId}`);
  }

  static async startMatching(teamId: number) {
    return api.post(`/api/matching/start/${teamId}`);
  }

  static async assignMission(subGroupId: number) {
    return api.post(`/api/missions/assign/subgroup/${subGroupId}`);
  }
}

export default MatchingService