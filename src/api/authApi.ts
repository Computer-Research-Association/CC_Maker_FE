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
    const response = await api.post("/api/user/register", params);
    console.log("✅ 회원가입 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원가입 에러:", error);
    console.error("❌ 에러 상태:", error.response?.status);
    console.error("❌ 에러 데이터:", error.response?.data);
    console.error("❌ 에러 헤더:", error.response?.headers);

    // 서버에서 오는 구체적인 에러 메시지 처리
    let errorMessage = "회원가입에 실패했습니다.";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

// ✅ 로그인
export async function login({
  email,
  password,
}: LoginParams): Promise<LoginResponse> {
  console.log("🔐 로그인 API 호출 시작:", { email, password: "***" });
  try {
    console.log("📤 서버로 로그인 요청 전송...");
    const response = await api.post("/api/auth/login", { email, password });
    console.log("✅ 로그인 응답 받음:", response.status);

    // ✅ 서버 응답에서 토큰 추출
    const { accessToken, refreshToken, data } = response.data;
    console.log("🔑 토큰 추출:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasData: !!data,
    });

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
    console.error("❌ 로그인 에러 발생");
    console.error("❌ 에러 타입:", typeof error);
    console.error("❌ 에러 객체:", error);
    console.error("❌ 에러 응답:", error.response?.data);
    console.error("❌ 에러 상태:", error.response?.status);
    console.error("❌ 에러 메시지:", error.message);

    // 서버에서 오는 구체적인 에러 메시지 처리
    let errorMessage = "로그인에 실패했습니다.";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      console.log("📨 서버 에러 메시지:", errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
      console.log("📨 클라이언트 에러 메시지:", errorMessage);
    }

    console.log("📤 최종 에러 메시지 전달:", errorMessage);
    throw new Error(errorMessage);
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
