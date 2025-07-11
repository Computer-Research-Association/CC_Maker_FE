// navigation/types.ts

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  JoinScreen: undefined;
  InviteScreen: undefined;
  SettingScreen: undefined;
  StartScreen: undefined;
  HomeScreen: { teamId: string };
  MbtiScreen: undefined;
  MainHomeScreen: undefined;
  MypageScreen: undefined;
  MissionScreen: undefined;
  CheckScreen: undefined;
  QuestionScreen: { index: number; mbti: string; answers: number[] };
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  teamId: number | null;
  teamName: string | null;
  userId: number;
}

