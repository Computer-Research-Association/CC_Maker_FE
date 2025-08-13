// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from "react";

type UserContextType = {
  userId: number | null;
  setUserId: (id: number | null) => void;
  name: string;
  setName: (name: string) => void;
};

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  name: "",
  setName: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");

  return (
    <UserContext.Provider value={{ userId, setUserId, name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
