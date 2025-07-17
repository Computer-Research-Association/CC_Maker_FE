import React, { createContext, useState, ReactNode } from "react";

interface TeamContextType {
  teamId: number | null;
  setTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  subGroupId: number | null;               // 추가
  setSubGroupId: React.Dispatch<React.SetStateAction<number | null>>;  // 추가
}

export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: () => {},
  role: null,
  setRole: () => {},
  userName: null,
  setUserName: () => {},
  subGroupId: null,               // 추가
  setSubGroupId: () => {},        // 추가
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [subGroupId, setSubGroupId] = useState<number | null>(null);  // 추가



  return (
    <TeamContext.Provider
      value={{
        teamId,
        setTeamId,
        role,
        setRole,
        userName,
        setUserName,
        subGroupId,          // 추가
        setSubGroupId,       // 추가
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
