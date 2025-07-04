// navigation/types.ts

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  JoinScreen: undefined; // 로그인 성공 시 이동할 화면이 있다면 추가
  InviteScreen:undefined;
  HomeScreen:undefined;
  SettingScreen:undefined;
  StartScreen:undefined;
  MbtiScreen: undefined;
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
