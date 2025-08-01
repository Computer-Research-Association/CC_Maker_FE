// controllers/MatchingFlowController.ts

import MatchingService from "../services/MatchingService";

export class MatchingFlowController {
  constructor(
    private teamId: number,
    private userId: number,
    private updateSubGroup: (subGroupId: number | null) => void
  ) {}

  async execute(): Promise<"done" | "fail"> {
    try {
      //API호출
      const response = await MatchingService.startMatching(this.teamId);

      if (!response.data?.matchingStarted) return "fail";
      //매칭 실제로 시작되지 않았다면 실패
      const subGroupId = await MatchingService.getSubGroupId(this.teamId, this.userId);
      this.updateSubGroup(subGroupId);
      //새로 받은 소그룹 ID를 업데이트(전역 상태에 저장)
      if (subGroupId !== null) {
        await MatchingService.assignMission(subGroupId);
      }

      return "done";
    } catch (error) {
      console.error("매칭 플로우 중 오류:", error);
      return "fail";
    }
  }
}
