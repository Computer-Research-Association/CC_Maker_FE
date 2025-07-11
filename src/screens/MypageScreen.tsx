import React, { useState,useEffect,useContext } from "react";
import { View, Text, TouchableOpacity,Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/MypageScreen.syles";
import MbtiScreen from "../screens/MbtiScreen";
import SettingsScreen from "./SettingScreen";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";

import { TeamContext } from './TeamContext';

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};



export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState<boolean>(false);
  const { teamId } = useContext(TeamContext);
  const userName = "김예준";
  const month = "7월";
  const writtenCount = 0;

  useEffect(() => {
    if (!teamId) return;

    // API 호출해서 설문 완료 여부 가져오기
    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status`);
        console.log("설문 완료 조회 ", response);
        // 예: { issurveycompleted: true }
        setIsSurveyCompleted(response.data.issurveycompleted);
      } catch (error) {
        console.error("설문 완료 상태 조회 실패", error);
      }
    };

    fetchSurveyStatus();
  }, [teamId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("눌림!");
          navigation.navigate("SettingScreen");
        }}
      >
        <Ionicons
          name="settings-outline"
          size={28}
          color="#000"
          style={styles.settingIcon}
        />
      </TouchableOpacity>
      {/* ✅ 중앙 정렬된 상단 프로필 */}
      <View style={styles.profileRow}>
        {/* 왼쪽 프로필 */}
        <View style={styles.profileBlock}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{userName}</Text>
        </View>

        {/* 오른쪽 프로필 */}
        <View style={styles.profileBlock}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{userName}</Text>
        </View>
      </View>

      {/* ✅ 아이콘 제거됨 */}

      {/* 탭 영역 */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>다이어리</Text>
      </View>

      {/* 작성 현황 */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

      {/* 작성 안내 */}
      <View style={styles.emptyNoteContainer}>
        <Text style={styles.emptyNoteText}>아직 매칭된 상대가 없어요</Text>
        <TouchableOpacity
            style={styles.writeButtonMain}
            onPress={() => {
              if (isSurveyCompleted) {
                Alert.alert("알림", "이미 설문조사를 완료했습니다.", [{ text: "확인" }]);
              } else {
                navigation.navigate("MbtiScreen");
              }
            }}
          >
  <Text style={styles.writeButtonMainText}>매칭시작하기</Text>
</TouchableOpacity>
      </View>
    </View>
  );
}
