// src/api/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//이놈 나중에 공인 도메인/ip로 변경해야한다
//지금은 cra와이파이로 고정해놓자
const BASE_URL = 'http://142.17.128.94:8080';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken = '';
let refreshToken = '';

/**
 * 앱 시작 시 AsyncStorage에서 토큰을 불러와 메모리 변수에 세팅
 */
async function initializeTokens(): Promise<void> {
  try {
    accessToken = (await AsyncStorage.getItem(ACCESS_TOKEN_KEY)) ?? '';
    refreshToken = (await AsyncStorage.getItem(REFRESH_TOKEN_KEY)) ?? '';
  } catch (e) {
    console.error('토큰 초기화 중 오류 발생:', e);
    accessToken = '';
    refreshToken = '';
  }
}
// 모듈 로드 시 자동 실행 (필요 시 앱 진입점에서 명시 호출로 변경 가능)
initializeTokens();

/**
 * 새로운 액세스/리프레시 토큰 저장
 */
export async function setTokens(newAccessToken: string, newRefreshToken: string): Promise<void> {
  try {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  } catch (e) {
    console.error('토큰 저장 중 오류 발생:', e);
  }
}

/**
 * 토큰 삭제 (로그아웃 시 호출)
 */
export async function clearTokens(): Promise<void> {
  try {
    accessToken = '';
    refreshToken = '';
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    console.error('토큰 삭제 중 오류 발생:', e);
  }
}

/**
 * 로그아웃 처리 함수 (앱 상황에 맞게 구현 필요)
 */
async function handleLogout() {
  await clearTokens();
  // TODO: 네비게이션 초기화, 로그인 화면 이동, 사용자 알림 등 추가 구현
  console.log('사용자 로그아웃 처리 필요');
}

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// 요청 인터셉터: 모든 요청에 Authorization 헤더로 액세스 토큰 붙임
api.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 리프레시 토큰으로 액세스 토큰 갱신
 * @throws {Error} 리프레시 토큰 없거나 갱신 실패 시 예외 발생
 */
async function refreshAccessToken(): Promise<void> {
  if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');

  const response = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });

  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;

  await setTokens(newAccessToken, newRefreshToken);
}

// 401 응답 시 토큰 갱신 및 요청 재시도 처리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers && token) {
              originalRequest.headers['Authorization'] = `Bearer ${token as string}`;
            }
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        processQueue(null, accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await handleLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
