import React, { createContext, useState, ReactNode } from "react";

interface TeamContextType {
  teamId: number | null;
  setTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: () => {},
  role: null,
  setRole: () => {},
  userName: null,
  setUserName: () => {},
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <TeamContext.Provider
      value={{
        teamId,
        setTeamId,
        role,
        setRole,
        userName,
        setUserName,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
