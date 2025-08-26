export type FieldErrors = { name?: string; email?: string; pw?: string };
// 입력검증만 검사
export const validateAccount = (params: {
  name: string;
  email: string;
  enablePwChange: boolean;
  currentPw: string;
  newPw: string;
  confirmPw: string;
}): { ok: boolean; errors: FieldErrors } => {
  const { name, email, enablePwChange, currentPw, newPw, confirmPw } = params;
  const errors: FieldErrors = {};

  if (!name.trim()) errors.name = "이름을 입력해주세요.";
  if (!email.trim()) errors.email = "이메일을 입력해주세요.";
  else if (!/^\S+@\S+\.\S+$/.test(email))
    errors.email = "이메일 형식이 이상합니다.";

  if (enablePwChange) {
    if (!currentPw) errors.pw = "현재 비밀번호 입력해주세요.";
    else if (newPw.length < 8) errors.pw = "새 비밀번호는 8자 이상이 좋습니다.";
    else if (newPw !== confirmPw)
      errors.pw = "새 비밀번호 확인이 일치하지 않습니다.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
};
