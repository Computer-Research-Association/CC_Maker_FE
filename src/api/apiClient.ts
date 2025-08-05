import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://3.39.54.128:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// ✅ 요청 인터셉터: 저장된 Access Token을 Authorization 헤더에 추가
api.interceptors.request.use(
  async (config) => {
    const tokenData = await SecureStore.getItemAsync("auth_tokens");

    if (tokenData) {
      const { accessToken } = JSON.parse(tokenData);
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        console.log("📤 요청 시 Authorization 추가:", accessToken);
      }
    }

    console.log("🔼 요청 URL:", `${config.baseURL}${config.url}`);
    console.log("🔼 요청 헤더:", config.headers);
    console.log("🔼 요청 바디:", config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 로그인/갱신 시 서버에서 내려준 토큰 저장
api.interceptors.response.use(
  async (response: AxiosResponse) => {
    console.log("⬇️ 응답 상태:", response.status);

    if (response.data?.accessToken && response.data?.refreshToken) {
      await SecureStore.setItemAsync(
        "auth_tokens",
        JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
      console.log("✅ 토큰 저장됨:", response.data.accessToken);
    } else {
      console.log("⚠️ 응답에 토큰 없음");
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        console.log("❌ 세션 만료 → 로그아웃 필요");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Refresh Token으로 Access Token 갱신
async function refreshAccessToken(): Promise<void> {
  try {
    const tokenData = await SecureStore.getItemAsync("auth_tokens");
    if (!tokenData) throw new Error("저장된 토큰 없음");

    const { refreshToken } = JSON.parse(tokenData);

    const response = await api.post("/api/auth/refresh", null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (response.data?.accessToken && response.data?.refreshToken) {
      await SecureStore.setItemAsync(
        "auth_tokens",
        JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
      console.log("✅ 토큰 갱신 성공");
    }
  } catch (err) {
    console.error("🔁 토큰 갱신 실패:", err);
    throw err;
  }
}

// ✅ 초기 토큰 갱신 (앱 시작 시 호출)
export async function initializeTokens(): Promise<void> {
  try {
    await refreshAccessToken();
    console.log("✅ 초기 토큰 갱신 성공");
  } catch (error) {
    console.error("❌ 초기 토큰 갱신 실패:", error);
    throw error;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

export default api;
