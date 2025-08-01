// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { LoginResponse } from "../navigation/types";

type UserContextType = {
  userId: number | null;
  setUserId: (id: number | null) => void;
  name: string;
  setName: (name: string) => void;
  setUser: (user: LoginResponse) => void;
};

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  name: "",
  setName: () => {},
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");

  const setUser = (user: LoginResponse) => {
    setUserId(user.userId);
    setName(user.name);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, name, setName, setUser }}>
      {children}
    </UserContext.Provider>
  );
};