import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

export const useLogout = (navigation: NativeStackNavigationProp<RootStackParamList, "SettingScreen">) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // AsyncStorage 초기화
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("userId");

      // 네비게이션 스택 초기화 후 Login으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
      console.error(error);
    }
  }, [navigation]);

  return {
    modalVisible,
    openModal,
    closeModal,
    handleLogout
  };
};


