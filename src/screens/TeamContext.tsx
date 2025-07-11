import React, { createContext, useState, ReactNode } from "react";

interface TeamContextType {
   teamId: string | null;
  setTeamId: React.Dispatch<React.SetStateAction<string | null>>;
  role: string | null;  // 예: "LEADER", "MEMBER"
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TeamContext = createContext<TeamContextType>({
    teamId: null,
    setTeamId: () => {},
    role: null,
    setRole: () => {},
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <TeamContext.Provider value={{ teamId, setTeamId, role, setRole }}>
      {children}
    </TeamContext.Provider>
  );
};
