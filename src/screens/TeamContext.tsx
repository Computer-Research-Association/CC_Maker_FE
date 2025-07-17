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
}


export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: () => {},
  role: null,
  setRole: () => {},
  userName: null,
  setUserName: () => {},
  subGroupIdMap: {},         // 빈 객체 초기값
  setSubGroupIdMap: () => {},
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [subGroupIdMap, setSubGroupIdMap] = useState<Record<number, number | null>>({});  // 팀별 서브그룹 아이디 맵


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
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
