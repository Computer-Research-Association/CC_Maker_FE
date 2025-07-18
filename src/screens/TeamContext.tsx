import React, { createContext, useState, ReactNode } from "react";

interface TeamContextType {
  teamId: number | null;
  setTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  subGroupIdMap: Record<number, number | null>;   // 팀별 서브그룹 아이디 맵
  setSubGroupIdMap: React.Dispatch<React.SetStateAction<Record<number, number | null>>>;
  updateSubGroupId: (teamId: number, subGroupId: number | null) => void;  // 추가

}

const noop = () => {};
export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: noop,
  role: null,
  setRole: noop,
  userName: null,
  setUserName: noop,
  subGroupIdMap: {},
  setSubGroupIdMap: noop,
  updateSubGroupId: noop,
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [subGroupIdMap, setSubGroupIdMap] = useState<Record<number, number | null>>({});

  // 팀별 서브그룹 아이디를 쉽게 업데이트하는 함수
  const updateSubGroupId = (teamId: number, subGroupId: number | null) => {
    setSubGroupIdMap(prev => ({ ...prev, [teamId]: subGroupId }));
  };

  return (
    <TeamContext.Provider
      value={{
        teamId,
        setTeamId,
        role,
        setRole,
        userName,
        setUserName,
        subGroupIdMap,
        setSubGroupIdMap,
        updateSubGroupId,  // 추가
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};