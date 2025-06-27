import React, { useState } from 'react';    
import {View,TextInput,Alert,Text,TouchableOpacity,StyleSheet,} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { signup } from '../api/authApi';  // api 함수 import
import {GestureHandlerRootView} from 'react-native-gesture-handler';



type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};




//모듈 외부로 넘기기, 이름은 자유로 설정 가능, 함수형(네비로 화면 이동 가능)
export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>(''); // 생년월일 추가
  const [emailId, setEmailId] = useState<string>('');
  const [emailDomain, setEmailDomain] = useState<string>('@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [teamSelect, setTeamSelect] = useState<'TeamLeader' | 'TeamMember'>('TeamLeader');

  const [open, setOpen] = useState<boolean>(false);
  const [domainItems, setDomainItems] = useState<ItemType<string>[]>([
    { label: '@naver.com', value: '@naver.com' },
    { label: '@handong.ac.kr', value: '@handong.ac.kr' },
    { label: '@gmail.com', value: '@gmail.com' },
  ]);

  const [year, setYear] = useState<string>('2000');
const [month, setMonth] = useState<string>('01');
const [day, setDay] = useState<string>('01');

const yearItems = Array.from({ length: 100 }, (_, i) => {
  const y = `${2024 - i}`;
  return { label: y, value: y };
});

const monthItems = Array.from({ length: 12 }, (_, i) => {
  const m = (i + 1).toString().padStart(2, '0');
  return { label: m, value: m };
});

const dayItems = Array.from({ length: 31 }, (_, i) => {
  const d = (i + 1).toString().padStart(2, '0');
  return { label: d, value: d };
});

const [openYear, setOpenYear] = useState(false);
const [openMonth, setOpenMonth] = useState(false);
const [openDay, setOpenDay] = useState(false);
  
  // async 비동기 함수시작 
  const handleSignup = async () => {
  const email = emailId + emailDomain; //merge email
  
    if(!name || !birthDate || !emailId || !password) {
      Alert.alert('입력 오류', '모든 항목을 입력하세요.');
      return;
    }

    
    try {
      //log 남기기 나중에 지우기
      const result  = await signup({ name, birthDate, email, password, gender });
      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
      console.log('서버 응답:', result);
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '서버 오류');
    }
  };

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
<View style={styles.birthRow}>
  <View style={styles.birthDropdown}>
    <DropDownPicker
      open={openYear}
      value={year}
      items={yearItems}
      setOpen={setOpenYear}
      setValue={setYear}
      // setItems={() => {}} // 고정 리스트라 생략 가능
      placeholder="년도"
      style={[styles.dropdown, styles.birthDropdownLeft]}
      dropDownContainerStyle={[styles.dropdownContainer,{maxHeight: 220}]}
      listMode="FLATLIST"
      scrollViewProps={{
      nestedScrollEnabled: true,   // ✅ 내부 스크롤 허용
    }}
      zIndex={3000}
      zIndexInverse={1000}
    />
  </View>
  <View style={styles.birthDropdown}>
    <DropDownPicker
      open={openMonth}
      value={month}
      items={monthItems}
      setOpen={setOpenMonth}
      setValue={setMonth}
      setItems={() => {}}
      placeholder="월"
      style={[styles.dropdown, styles.birthDropdownMiddle]}
      dropDownContainerStyle={styles.dropdownContainer}
      zIndex={2000}
      zIndexInverse={2000}
    />
  </View>
  <View style={styles.birthDropdown}>
    <DropDownPicker
      open={openDay}
      value={day}
      items={dayItems}
      setOpen={setOpenDay}
      setValue={setDay}
      setItems={() => {}}
      placeholder="일"
      style={[styles.dropdown, styles.birthDropdownRight]}
      dropDownContainerStyle={[styles.dropdownContainer,]}
      zIndex={1000}
      zIndexInverse={3000}
      listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
    />
  </View>
</View>

      <Text style={styles.label}>이메일</Text>
      <View style={styles.emailRow}>
        <TextInput
          placeholder="이메일 아이디"
          onChangeText={setEmailId}
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

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        placeholder="비밀번호는8자이상"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />

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
              value="TeamLeader"
              status={teamSelect === 'TeamLeader' ? 'checked' : 'unchecked'}
              onPress={() => setTeamSelect('TeamLeader')}
            />
            <Text>팀장</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="TeamMember"
              status={teamSelect === 'TeamMember' ? 'checked' : 'unchecked'}
              onPress={() => setTeamSelect('TeamMember')}
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

const styles = StyleSheet.create({
  container: { padding: 50, flex: 1, backgroundColor: '#ffe6cc' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
  },
  radioGroup: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  roundButton: {
    backgroundColor: '#f4a261',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  roundButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  emailInput: {
    flex: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownWrapper: {
    flex: 6,
    zIndex: 1000,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
    maxHeight: 200,
  },
  birthRow: {
  flexDirection: 'row',
  marginBottom: 20,
  zIndex: 3000,
},
birthDropdown: {
  flex: 1,
  zIndex: 3000,
},
dropdown2:{
   padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,

    backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
birthDropdownLeft: {
  borderTopLeftRadius: 10,
  borderBottomLeftRadius: 10,
  borderRightWidth: 0,
  borderLeftWidth: 1,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,

},

birthDropdownMiddle: {
  borderRadius: 0, // 네 모서리 모두 0
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
},

birthDropdownRight: {
  borderTopRightRadius: 10,
  borderBottomRightRadius: 10,
  borderLeftWidth: 0,
},
});