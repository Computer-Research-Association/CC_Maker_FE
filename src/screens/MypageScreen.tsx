import React, { useState, useEffect, useContext, useId } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/MypageScreen.syles";
import MbtiScreen from "../screens/MbtiScreen";
import SettingsScreen from "./SettingScreen";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";

import { TeamContext } from "./TeamContext";

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState<boolean>(false);
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const { teamId, userName } = useContext(TeamContext);

  const month = "7월";
  const writtenCount = 0;

  useEffect(() => {
    if (!teamId) return;

    // 설문 완료 여부 조회
    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status`);
        setIsSurveyCompleted(response.data.issurveycompleted);
      } catch (error) {
        console.error("설문 완료 상태 조회 실패", error);
      }
    };

    // 매칭된 상대 이름 조회
    const fetchMatchedNames = async () => {
      try {
        const response = await api.get(`/api/matching/matched-names`);
        console.log("🔍 매칭된 이름 응답:", response.data); // ✅ 콘솔 출력 추가

        setMatchedNames(response.data);
      } catch (error) {
        console.error("매칭된 이름 조회 실패", error);
      }
    };

    fetchSurveyStatus();
    fetchMatchedNames();

  }, [teamId]);
  //나중에 지우기
  useEffect(() => {
  console.log("매칭된 이름들:", matchedNames);
}, [matchedNames]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("SettingScreen")}>
        <Ionicons
          name="settings-outline"
          size={28}
          color="#000"
          style={styles.settingIcon}
        />
      </TouchableOpacity>

      {/* 프로필과 매칭된 상대 이름 */}
      <View style={styles.profileRow}>
        {/* 내 프로필 */}
        <View style={styles.profileBlock}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{teamId}</Text>
        </View>

        {/* 매칭된 상대 프로필 및 이름 */}
        <View style={styles.profileBlock}>
          
          <View style={styles.avatar} />
          {matchedNames.length > 0 ? (
            matchedNames.map((name) => (
              <Text key={name} style={styles.name}>
                {name}
              </Text>
            ))
          ) : (
            <Text style={styles.name}>아직 매칭된 상대가 없어요</Text>
          )}
        </View>
      </View>

      {/* 탭, 작성 현황 등 기존 내용 유지 */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>다이어리</Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

      {/* 매칭된 상대 없으면 설문 시작 버튼 노출 */}
      {matchedNames.length === 0 && (
        <View style={styles.emptyNoteContainer}>
          <TouchableOpacity
            style={styles.writeButtonMain}
            onPress={() => {
              if (isSurveyCompleted) {
                Alert.alert("알림", "이미 설문조사를 완료했습니다.", [
                  { text: "확인" },
                ]);
              } else {
                navigation.navigate("MbtiScreen");
              }
            }}
          >
            <Text style={styles.writeButtonMainText}>설문시작하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
