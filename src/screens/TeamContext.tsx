import React, { createContext, useState, ReactNode } from "react";

interface TeamContextType {
  teamId: string | null;
  setTeamId: React.Dispatch<React.SetStateAction<string | null>>; 
}

export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: () => {},
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<string | null>(null);

  return (
    <TeamContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </TeamContext.Provider>
  );
};
