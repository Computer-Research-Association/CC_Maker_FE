import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ItemType } from 'react-native-dropdown-picker';
import { signup } from '../api/authApi';

export type Gender = 'male' | 'female';

export const useSignupForm = (navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>) => {
  // 이름
  const [name, setName] = useState<string>('');

  // 생년월일
  const [birthYear, setBirthYear] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  const [birthError, setBirthError] = useState<string>('');

  // 이메일
  const [emailId, setEmailId] = useState<string>('');
  const [emailDomain, setEmailDomain] = useState<string>('@gmail.com');
  const [emailError, setEmailError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [domainItems, setDomainItems] = useState<ItemType<string>[]>([
    { label: '@naver.com', value: '@naver.com' },
    { label: '@handong.ac.kr', value: '@handong.ac.kr' },
    { label: '@gmail.com', value: '@gmail.com' },
  ]);

  // 비밀번호
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  // 성별
  const [gender, setGender] = useState<Gender>('male');

  // utils
  const onlyNumber = useCallback((text: string) => text.replace(/[^0-9]/g, ''), []);

  const getPasswordErrorMessage = useCallback((pwd: string) => {
    if (pwd.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (!/[a-zA-Z]/.test(pwd)) return '영문자를 포함해야 합니다.';
    if (!/[0-9]/.test(pwd)) return '숫자를 포함해야 합니다.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return '특수문자를 포함해야 합니다.';
    return '';
  }, []);

  const validateEmailId = useCallback((id: string) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(id)) {
      setEmailError('아이디는 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.');
    } else {
      setEmailError('');
    }
  }, []);

  const validateFullDate = useCallback((y: string, m: string, d: string) => {
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);

    let isValid = true;

    if (!y || !m || !d || isNaN(year) || isNaN(month) || isNaN(day) || year < 1900 || year > new Date().getFullYear() || month < 1 || month > 12) {
      isValid = false;
    } else {
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        isValid = false;
      }
    }

    setBirthError(isValid ? '' : '올바른 생년월일을 입력하세요.');
  }, []);

  // 제출 로직 - 개인정보 동의는 별도 훅이므로 파라미터로 받음
  const handleSignup = useCallback(async (
    privacyAgreed: boolean,
    privacyVersion: string,
    setPrivacyError: (msg: string) => void,
  ) => {
    const email = emailId + emailDomain;
    const birthdate = `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

    if (!name || !birthYear || !birthMonth || !birthDay || !emailId || !password) {
      Alert.alert('입력 오류', '모든 항목을 입력하세요.');
      return;
    }

    if (birthError !== '') {
      Alert.alert('입력 오류', '올바른 생년월일을 입력하세요.');
      return;
    }

    const pwdErr = getPasswordErrorMessage(password);
    if (pwdErr !== '') {
      Alert.alert('입력 오류', pwdErr);
      return;
    }

    if (emailError !== '') {
      Alert.alert('입력 오류', '올바른 이메일 아이디를 입력하세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!privacyAgreed) {
      setPrivacyError('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    try {
      const result = await signup({
        name,
        birthdate,
        email,
        password,
        gender,
        privacyAgreementVersion: privacyVersion,
        privacyAgreed: privacyAgreed,
        privacyAgreedAt: new Date().toISOString(),
        privacyAgreedMethod: '회원가입',
        privacyAgreedEnvironment: 'APP',
      });
      console.log('✅ 회원가입 성공:', result);
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('❌ 회원가입 에러:', error);
      Alert.alert('회원가입 실패', error?.message || '서버 오류');
    }
  }, [
    name,
    birthYear,
    birthMonth,
    birthDay,
    emailId,
    emailDomain,
    birthError,
    getPasswordErrorMessage,
    emailError,
    password,
    confirmPassword,
    gender,
    navigation,
  ]);

  return {
    // values
    name,
    birthYear,
    birthMonth,
    birthDay,
    birthError,
    emailId,
    emailDomain,
    emailError,
    open,
    domainItems,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    gender,

    // setters & handlers
    setName,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    setBirthError,
    setEmailId,
    setEmailDomain,
    setEmailError,
    setOpen,
    setDomainItems,
    setPassword,
    setPasswordError,
    setConfirmPassword,
    setConfirmPasswordError,
    setGender,

    onlyNumber,
    validateFullDate,
    validateEmailId,
    getPasswordErrorMessage,
    handleSignup,
  };
};
