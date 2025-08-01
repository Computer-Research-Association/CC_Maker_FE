import api from "./apiClient";
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "../navigation/types";

interface SignupParams {
  name: string;
  birthdate: string;
  email: string;
  password: string;
  gender: "male" | "female";
}

interface LoginParams {
  email: string;
  password: string;
}

// ✅ 회원가입
export async function signup(params: SignupParams): Promise<any> {
  try {
    console.log("📨 회원가입 요청:", params);
    const response = await api.post("/register", params);
    console.log("✅ 회원가입 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("회원가입 에러:", error);
    throw new Error(error.response?.data?.message || "회원가입 실패");
  }
}

// ✅ 로그인
export async function login({
  email,
  password,
}: LoginParams): Promise<LoginResponse> {
  console.log("로그인 API 호출:", { email, password });
  try {
    const response = await api.post("/api/auth/login", { email, password });

    // ✅ 서버 응답에서 토큰 추출
    const { accessToken, refreshToken, data } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("토큰이 응답에 없습니다.");
    }

    // ✅ 보안 저장소에 토큰 저장
    await SecureStore.setItemAsync(
      "auth_tokens",
      JSON.stringify({ accessToken, refreshToken })
    );

    console.log("✅ 토큰 저장 완료");
    return data as LoginResponse;
  } catch (error: any) {
    console.error("로그인 에러:", error);
    throw new Error(error.response?.data?.message || "로그인에 실패했습니다.");
  }
}

// ✅ 로그아웃
export async function logout(navigation: any): Promise<void> {
  try {
    // ✅ 서버 로그아웃 요청 (Authorization 헤더에 refreshToken)
    const tokenData = await SecureStore.getItemAsync("auth_tokens");
    if (tokenData) {
      const { refreshToken } = JSON.parse(tokenData);
      await api.post("/api/auth/logout", null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      console.log("✅ 서버 로그아웃 완료");
    }

    // ✅ 클라이언트 저장된 토큰 삭제
    await SecureStore.deleteItemAsync("auth_tokens");
    console.log("🗑 토큰 삭제 완료");

    // ✅ 로그인 화면으로 이동
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    console.error("서버 로그아웃 실패:", error);
    throw error;
  }
}

// ✅ 인증이 필요한 API 호출
export async function getUserInfo() {
  const tokenData = await SecureStore.getItemAsync("auth_tokens");
  if (!tokenData) throw new Error("토큰 없음");

  const { accessToken } = JSON.parse(tokenData);
  const response = await api.get("/api/user/info", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data;
}
