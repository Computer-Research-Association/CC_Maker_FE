import React, { useState } from 'react';    
import {View,TextInput,Alert,Text,TouchableOpacity,StyleSheet,} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { ItemType } from 'react-native-dropdown-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DropDownPicker from 'react-native-dropdown-picker';
import { signup } from '../api/authApi';  // api 함수 import
import styles from '../styles/SignupScreen.styles'

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

//모듈 외부로 넘기기, 이름은 자유로 설정 가능, 함수형(네비로 화면 이동 가능)
export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [name, setName] = useState<string>('');
   // 연, 월, 일을 각각 상태로 분리
  const [birthYear, setBirthYear] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');

  //생년월일 에러메세지
  const [birthError, setBirthError] = useState('');

  //이메일
  const [emailId, setEmailId] = useState<string>('');
  const [emailDomain, setEmailDomain] = useState<string>('@gmail.com');
  const [emailError, setEmailError] = useState<string>(''); // 에러 메세지
  //비밀번호
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState(''); //에러 메세지
  //성별
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [open, setOpen] = useState<boolean>(false);
  const [domainItems, setDomainItems] = useState<ItemType<string>[]>([
    { label: '@naver.com', value: '@naver.com' },
    { label: '@handong.ac.kr', value: '@handong.ac.kr' },
    { label: '@gmail.com', value: '@gmail.com' },
  ]);

  //그룹
  const [role, setRole] = useState<'LEADER' | 'MEMBER'>('LEADER');
  //년월일 검사기
  const validateFullDate = (y: string, m: string, d: string) => {
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);

  let isValid = true;

  if (!y || !m || !d || isNaN(year) || isNaN(month) || isNaN(day) || year < 1900 || year > new Date().getFullYear() || month < 1 || month > 12) {
    isValid = false;
  } else {
    const date = new Date(year, month - 1, day); //다시 공부 
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      isValid = false;
    }
  }

  setBirthError(isValid ? '' : '올바른 생년월일을 입력하세요.');
}

const getPasswordErrorMessage = (password: string) => {
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
  if (!/[a-zA-Z]/.test(password)) return '영문자를 포함해야 합니다.';
  if (!/[0-9]/.test(password)) return '숫자를 포함해야 합니다.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return '특수문자를 포함해야 합니다.';
  return '';
}
const validateEmailId = (id: string) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(id)) {
    setEmailError('아이디는 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.');
  } else {
    setEmailError('');
  }
};

  
  // async 비동기 함수시작 
  const handleSignup = async () => {
  const email = emailId + emailDomain; //merge email
  const birthdate = `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

    if (!name || !birthYear || !birthMonth || !birthDay || !emailId || !password) {
      Alert.alert('입력 오류', '모든 항목을 입력하세요.');
      return;
    } 
    //생년월일 오류(중복적이지 않나?)
    if (birthError !== '') {
      Alert.alert('입력 오류', '올바른 생년월일을 입력하세요.');
      return;
    }
    //비번 오류
    const passwordErr = getPasswordErrorMessage(password);
      if (passwordErr !== '') {
      Alert.alert('입력 오류', passwordErr);
      return;
    }

    //이메일 오류
    if (emailError !== '') {
      Alert.alert('입력 오류', '올바른 이메일 아이디를 입력하세요.');
      return;
    }

    try {
      //log 남기기 나중에 지우기
      const result  = await signup({ name, birthdate , email, password, gender, role});
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
      console.log('서버 응답:', result);
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '서버 오류');
    }
  };

  const onlyNumber = (text: string) => text.replace(/[^0-9]/g, ''); //선택사항 나중에 지우기
  
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        placeholder="이름"
        onChangeText={setName}
        value={name}
        style={styles.input}
      />

      <Text style={styles.label}>생년월일</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <TextInput
          placeholder="년(YYYY)"
          value={birthYear}
          onChangeText={text => {
            const val = onlyNumber(text);
            setBirthYear(val);
            validateFullDate(val, birthMonth, birthDay);
          }}
          keyboardType="numeric"
          maxLength={4}
          style={[styles.input, { flex: 3, marginRight: 5 }]}
        />
        <TextInput
          placeholder="월(MM)"
          value={birthMonth}
          onChangeText={text => {
            const val = onlyNumber(text);
            setBirthMonth(val);
            validateFullDate(birthYear, val, birthDay);
          }}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, { flex: 2, marginHorizontal: 5 }]}
        />
        <TextInput
          placeholder="일(DD)"
          value={birthDay}
          onChangeText={text => {
            const val = onlyNumber(text);
            setBirthDay(val);
            validateFullDate(birthYear, birthMonth, val);
          }}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, { flex: 2, marginLeft: 5 }]}
        />
      </View>

      <View style={{marginBottom: 10, marginVertical:-20}}>
        <Text style={{ color: birthError ? 'red' : 'transparent', fontSize: 12 }}>
          {birthError || '올바른 생년월일을 입력하세요.'}
        </Text>
      </View>

      <Text style={styles.label}>이메일</Text>
      <View style={styles.emailRow}>
        <TextInput
          placeholder="이메일 아이디"
          onChangeText={(text) => {
            setEmailId(text);
            validateEmailId(text); // 유효성 검사 호출
          }}
          value={emailId}
          style={styles.emailInput}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <DropDownPicker
          open={open}
          value={emailDomain}
          items={domainItems}
          setOpen={setOpen}
          setValue={setEmailDomain}
          setItems={setDomainItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          containerStyle={styles.dropdownWrapper}
          zIndex={1000}
          zIndexInverse={3000}
        />
      </View>
      {emailError ? (
      <Text style={{ color: 'red', fontSize: 12, marginTop: -15, marginBottom: 10 }}>
      {emailError}
      </Text>
      ) : null}

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        placeholder="영문+숫자+특수문자 포함, 8자 이상"
         onChangeText={(text) => {
          setPassword(text);
          setPasswordError(getPasswordErrorMessage(text));
        }}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      {passwordError ? (
      <Text style={{ color: 'red', fontSize: 12, marginTop: -15, marginBottom: 10 }}>
        {passwordError}
      </Text>
    ) : null}

      <Text style={styles.label}>성별</Text>
      <View style={styles.genderBox}>
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => setGender('male')}
            />
            <Text>남성</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => setGender('female')}
            />
            <Text>여성</Text>
          </View>
        </View>
      </View>

    <Text style={styles.label}>선택</Text>          
      <View style={styles.genderBox}>
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton
              value="LEADER"
              status={role === 'LEADER' ? 'checked' : 'unchecked'}
              onPress={() => setRole('LEADER')}
            />
            <Text>팀장</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="MEMBER"
              status={role === 'MEMBER' ? 'checked' : 'unchecked'}
              onPress={() => setRole('MEMBER')}
            />
            <Text>팀원</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.roundButton} onPress={handleSignup}>
        <Text style={styles.roundButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );

}
