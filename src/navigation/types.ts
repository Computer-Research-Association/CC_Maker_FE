// navigation/types.ts

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  TeamMemberScreen: undefined; // 로그인 성공 시 이동할 화면이 있다면 추가
  TeamLeaderScreen:undefined;
  HomeScreen:undefined;
  SettingScreen:undefined;
  StartScreen:undefined;
  MbtiScreen: undefined;
  MypageScreen:undefined;
  MissionScreen:undefined;
  CheckScreen:undefined;
  QuestionScreen:{index: number };
  
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
  teamId: number | null;
  teamName: string | null;
  userId: number;
}
