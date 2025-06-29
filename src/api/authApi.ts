const BASE_URL = 'http://172.17.128.94:8080';

//회원가입에 필요한 정보들
interface SignupParams {
  name: string;
  birthdate: string;
  email: string;
  password: string;
  gender: 'male' | 'female' ; 
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
    console.error('회원가입 에러:', error); //나중에 지우기
    throw new Error('서버와 통신할 수 없습니다.');
  }
}

//로그인
export async function login({ email, password }: LoginParams): Promise<{ accessToken: string; refreshToken?: string }> {
  console.log('로그인 API 호출 시작:', { email, password });

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const responseBody = await response.text(); // 먼저 text로 읽기
    console.log('서버 응답 원문:', responseBody);

    if (!responseBody) {
      throw new Error('서버 응답이 없습니다.');
    }

    let data;
    try {
      data = JSON.parse(responseBody); // JSON 파싱 시도
    } catch (e) {
      throw new Error('서버 응답을 JSON으로 파싱할 수 없습니다.');
    }

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    console.log('로그인 성공 응답:', data); // 응답 로그
    return data;
  } catch (error: any) {
    console.error('로그인 중 에러:', error);
    throw new Error(error.message || '서버와 통신할 수 없습니다.');
  }
}

