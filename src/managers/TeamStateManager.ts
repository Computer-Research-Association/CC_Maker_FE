// managers/TeamStateManager.ts
//subgroupID 상태관리 하기 위한 manager

export class TeamStateManager {
  constructor(//이전상태를 받아서 새상태를 반환하는 setmap함수의 인자를 받는다
    private setMap: (updater: (prev: Record<number, number | null>) => Record<number, number | null>) => void
  ) {}

  update(teamId: number, subGroupId: number | null) {
    this.setMap((prev) => ({
      ...prev,
      [teamId]: subGroupId,
    }));
  }
}
