import { setTokens } from "./apiClient";
import { LoginResponse } from "../navigation/types";

//이놈도 나중에 공인 도메인 ip로 바꿔야함
//지금은 cra와이파이로 고정해놓자
const BASE_URL = "https://192.168.29.132:8080";

//회원가입에 필요한 정보들
interface SignupParams {
  name: string;
  birthdate: string;
  email: string;
  password: string;
  gender: "male" | "female";
}

//로그인에 필요한 정보들
interface LoginParams {
  email: string;
  password: string;
}

// 회원가입 함수
export async function signup(params: SignupParams): Promise<any> {
  try {
    console.log("📨 회원가입 요청 시작:", params);
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "회원가입 실패");
    }

    console.log("✅ 회원가입 성공 응답:", data); //나중에 지우기
    return data;
  } catch (error) {
    console.error("회원가입 에러:", error); //나중에 지우기
    throw new Error("서버와 통신할 수 없습니다." + error);
  }
}

// 로그인 함수 (토큰 저장 포함)
export async function login({
  email,
  password,
}: LoginParams): Promise<LoginResponse> {
  console.log("로그인 API 호출 시작:", { email, password });

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseBody = await response.text();
    console.log("서버 응답 원문:", responseBody);

    if (!responseBody) {
      throw new Error("서버 응답이 없습니다.");
    }

    if (!response.ok) {
      const errorData = JSON.parse(responseBody) as { message?: string };
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    const data = JSON.parse(responseBody) as LoginResponse;
    console.log("로그인 성공 응답:", data);

    await setTokens(data.accessToken, data.refreshToken ?? "");

    return data;
  } catch (error: any) {
    console.error("로그인 중 에러:", error);
    throw new Error(error.message || "서버와 통신할 수 없습니다.");
  }
}
