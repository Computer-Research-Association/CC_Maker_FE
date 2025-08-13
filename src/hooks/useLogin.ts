// import { useState, useContext } from 'react';
// import { Alert } from 'react-native';
// import { UserContext } from '../screens/UserContext';
// import { authApi } from '../api/authApi';
// import { useNavigation } from '@react-navigation/native';

// export const useLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { setUser } = useContext(UserContext);
//   const navigation = useNavigation();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const userData = await authApi.login({ email, password });
//       setUser(userData);
//       navigation.navigate('MainHome');
//     } catch (error) {
//       Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     email,
//     setEmail,
//     password,
//     setPassword,
//     isLoading,
//     handleLogin,
//   };
// };
