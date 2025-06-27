import  { useState } from 'react';    
import { View, TextInput, Button, StyleSheet, Alert, Text,TouchableOpacity} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';



//모듈 외부로 넘기기, 이름은 자유로 설정 가능, 함수형(네비로 화면 이동 가능)
export default function SignupScreen({ navigation }) {
  
  //여기서부터는 Backend 처리부분
  //useState로 빈문자열 생성, email에 넣고, setEmail함수 호출
  const [name,setName] = useState('');  //name
  const [emailId, setEmailId] = useState(''); // 아이디 부분
  const [emailDomain, setEmailDomain] = useState('@gmail.com'); // 도메인 부분 (.com이 초기값)
  const [password, setPassword] = useState(''); 
  const [gender, setGender] = useState('male'); // 기본값: 남성
const [open, setOpen] = useState(false);
const [domainItems, setDomainItems] = useState([
  { label: '@naver.com', value: '@naver.com' },
  { label: '@handong.ac.kr', value: '@handong.ac.kr' },
  { label: '@gmail.com', value: '@gmail.com' },
]);


  
  // async 비동기 함수시작 
  const handleSignup = async () => {
  const email = emailId + emailDomain; //merge email
  
    if (!name || !email || !password) {  //email, password 비었거나 null인지 판단
      Alert.alert('입력 오류', '이름과 이메일과 비밀번호를 모두 입력하세요.'); //알람
      return;
    }

    
    try {
      const response = await fetch('http://192.168.29.245:8080/register', {
        method: 'POST',
         headers: {
         'Content-Type': 'application/json',  //표준 MIME 에서 json 형태
         },
         body: JSON.stringify({ email, password }), 
        });

        const json = await response.json();
console.log('서버 응답:', json); // 

      if (response.ok) {
        Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
        navigation.navigate('Login');
      } else {
        const errData = await response.json();
        Alert.alert('회원가입 실패', errData.message || '서버 오류');
      }
    } catch (error) {
      Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
    }
  };

  return (
    //여기서부터 UI
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.label}>이름</Text>
      <TextInput
        placeholder="이름"
        onChangeText={setName}
        value={name}
        style={styles.input}
      />
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
    // setItems={setDomainItems}
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer}
    containerStyle={styles.dropdownWrapper}
  />
</View>

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        placeholder="비밀번호"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>성별</Text>
<View style = {styles.genderBox}>
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

<TouchableOpacity style={styles.roundButton} onPress={handleSignup}>
          <Text style={styles.roundButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
    
    
  );
}


const styles = StyleSheet.create({
  container: { padding: 50 ,flex:1, backgroundColor:'#ffe6cc'},
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    color: 'black', // 입력된 텍스트 색상
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius:15,
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
  backgroundColor: 'rgba(255, 255, 255, 0.7)',      // 흰 배경
  borderRadius: 10,             // 모서리 둥글게
  padding: 3,                  // 안쪽 여백
  marginBottom: 20,             // 아래 여백                // 그림자 (Android)
  borderWidth: 1,
  borderColor: '#ccc',
},
roundButton: {
  backgroundColor: '#f4a261',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 15,          // ← 요게 버튼을 둥글게 만듭니다!
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
  zIndex: 1000, // DropDown이 겹치지 않도록 높게
},
emailInput: {
  flex: 5,
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 14,
  borderTopLeftRadius: 15,
  borderBottomLeftRadius: 15,
  borderRightWidth:0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},

dropdownWrapper: {
  flex: 6,
  zIndex: 1000,
},

dropdown: {
  padding:10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderTopRightRadius: 15,
  borderBottomRightRadius: 15,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeftWidth:0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},

dropdownContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  zIndex: 1000,
}
});
