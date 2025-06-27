const BASE_URL = 'http://192.168.29.245:8080';

//회원가입에 필요한 정보들
interface SignupParams {
  name: string;
  birthDate: string;   // 생년월일, 형식 예: '1990-01-01' (ISO 8601 권장)
  email: string;
  password: string;
  gender: 'male' | 'female' ;  // 성별, 필요한 경우 옵션 조정
}

//로그인에 필요한 정보들
interface LoginParams {
  email: string;
  password: string;
}


// 회원가입 함수
export async function signup(params: SignupParams): Promise<any> {
   try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '회원가입 실패');
    }

    return data;
  } catch (error) {
    throw new Error('서버와 통신할 수 없습니다.');
  }
}

// 로그인 함수 수정 필요(업데이트)
export async function login({ email, password }: LoginParams): Promise<{ accessToken: string }> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '로그인 실패');
  }

  // 예: { accessToken: '...' } 형태라고 가정
  return data;
}