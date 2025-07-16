import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/MypageScreen.syles";
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

    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status`);
        setIsSurveyCompleted(response.data.issurveycompleted);
      } catch (error) {
        console.error("설문 완료 상태 조회 실패", error);
      }
    };

    const fetchMatchedNames = async () => {
      try {
        const response = await api.get(`/api/matching/matched-names`);
        setMatchedNames(response.data);
      } catch (error) {
        console.error("매칭된 이름 조회 실패", error);
      }
    };

    fetchSurveyStatus();
    fetchMatchedNames();
  }, [teamId]);

  return (
    <View style={styles.container}>
      {/* 설정 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate("SettingScreen")}>
        <Ionicons
          name="settings-outline"
          size={28}
          color="#000"
          style={styles.settingIcon}
        />
      </TouchableOpacity>

      {/* 프로필 영역 */}
      <View style={styles.profileRow}>
        {/* 내 프로필 */}
        <View style={styles.profileBlock}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{userName}</Text>
        </View>

        {/* 매칭된 상대 프로필 */}
        {(() => {
          switch (matchedNames.length) {
            case 0:
              return (
                <View style={styles.profileBlock}>
                  <Text style={styles.name}>아직 매칭된 상대가 없어요</Text>
                </View>
              );
            case 1:
              return (
                <View style={styles.profileBlock}>
                  <View style={styles.avatar} />
                  <Text style={styles.name}>{matchedNames[0]}</Text>
                </View>
              );
            case 2:
              return (
                <>
                  <View style={styles.profileBlock}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>{matchedNames[0]}</Text>
                  </View>
                  <View style={styles.profileBlock}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>{matchedNames[1]}</Text>
                  </View>
                </>
              );
            case 3:
              return (
                <>
                  <View style={styles.profileBlock}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>{matchedNames[0]}</Text>
                  </View>
                  <View style={styles.profileBlock}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>{matchedNames[1]}</Text>
                  </View>
                  <View style={styles.profileBlock}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>{matchedNames[2]}</Text>
                  </View>
                </>
              );
            default:
              return matchedNames.map((name) => (
                <View key={name} style={styles.profileBlock}>
                  <View style={styles.avatar} />
                  <Text style={styles.name}>{name}</Text>
                </View>
              ));
          }
        })()}
      </View>

      {/* 다이어리 탭 */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>다이어리</Text>
      </View>

      {/* 미션 작성 현황 */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

      {/* 매칭 상대 없으면 설문 버튼 노출 */}
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
