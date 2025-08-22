// TeamContext를 쓰게 되면 어디서나 팀관련 정보를 꺼내거나 수정할 수 있음음


import React, { createContext, useState, ReactNode } from "react";


//이 context가 어떤 데이터와 함수를 제공하는가?(타입 약속에 가까움움)
interface TeamContextType {
  teamId: number | null;
  //이건 useState가 반환하는 setter 함수 타입임. (직접값을 전달하며, 함수로 이전 값 기반 변경을 허용하는 타입)
  setTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userName: string | null;
  teamName: string | null; 
  setTeamName: React.Dispatch<React.SetStateAction<string | null>>; 
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  subGroupIdMap: Record<number, number | null>;   // 팀별 서브그룹 아이디 맵
  setSubGroupIdMap: React.Dispatch<React.SetStateAction<Record<number, number | null>>>;
  updateSubGroupId: (teamId: number, subGroupId: number | null) => void;  // 추가

}
//그러니까 teamprovide로 감싸지않은 상태에서 usecontext를 호출하면 이 기본값을 사용하기 위함임. 
//약속을 가진 통로(context객체 를 생성하는거거)
const noop = () => {};
export const TeamContext = createContext<TeamContextType>({
  teamId: null,
  setTeamId: noop,
  role: null,
  teamName: null, 
  setTeamName: noop,
  setRole: noop,
  userName: null,
  setUserName: noop,
  subGroupIdMap: {},
  setSubGroupIdMap: noop,
  updateSubGroupId: noop,
});
//실제 state를 만들고 value를 전달하는 컴포넌트
// provider안에 속성을 넣어야하기 때문에 children을 받음.
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);    
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
        teamName,
        setTeamName,
        userName,
        setUserName,
        subGroupIdMap,
        setSubGroupIdMap,
        updateSubGroupId, 
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};