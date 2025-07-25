import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";
import { TeamContext } from "./TeamContext";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import styles from "../styles/MypageScreen.syles"; // ✅ 스타일 파일 적용

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId, name } = useContext(UserContext);
  const isFocused = useIsFocused();

  const subGroupId = teamId ? subGroupIdMap[teamId] : null;
  const month = "7월";
  const writtenCount = 0;

  // ✅ subGroupId 확인 및 저장
  useEffect(() => {
    if (!teamId || !isFocused || !userId) return;
    const fetchSubGroupIdIfNeeded = async () => {
      if (!subGroupId) {
        try {
          const response = await api.get(`/api/matching/subgroup/${teamId}`, {
            params: { userId },
          });
          const newSubGroupId = response.data.subGroupId ?? null;
          setSubGroupIdMap((prev) => {
            if (prev[teamId] === newSubGroupId) return prev;
            return { ...prev, [teamId]: newSubGroupId };
          });
        } catch (error) {
          console.error("subGroupId 조회 실패", error);
        }
      }
    };
    fetchSubGroupIdIfNeeded();
  }, [teamId, isFocused, subGroupId, userId, setSubGroupIdMap]);

  // ✅ 매칭된 멤버 이름 불러오기
  useEffect(() => {
    if (!teamId || !subGroupId || !isFocused || !userId) return;
    const fetchMatchedNames = async () => {
      try {
        const response = await api.get(
          `/api/matching/matched-names/${teamId}`,
          {
            params: { userId },
          }
        );
        setMatchedNames(response.data.matchedNames || []);
      } catch (error) {
        console.error("매칭된 이름 조회 실패", error);
      }
    };
    fetchMatchedNames();
  }, [teamId, subGroupId, isFocused, userId]);

  // ✅ 설문 완료 여부 확인
  useEffect(() => {
    if (!teamId || !isFocused) return;
    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status`);
        setIsSurveyCompleted(response.data.issurveycompleted);
      } catch (error) {
        console.error("설문 완료 상태 조회 실패", error);
      }
    };
    fetchSurveyStatus();
  }, [teamId, isFocused]);

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

      {/* ✅ 프로필 영역 */}
      <View style={styles.profileContainer}>
        {/* 본인 프로필 */}
        <View style={styles.myProfileBlock}>
          <View style={styles.myAvatar} />
          <Text style={styles.myName}>{name}</Text>
        </View>

        {/* 나머지 멤버 프로필 */}
        <View style={styles.otherProfilesContainer}>
          {matchedNames.length === 0 ? (
            <Text style={styles.noMatchText}>아직 매칭된 상대가 없어요</Text>
          ) : (
            matchedNames.map((name, idx) => (
              <View key={idx} style={styles.otherProfileBlock}>
                <View style={styles.otherAvatar} />
                <Text style={styles.otherName}>{name}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 다이어리 탭 */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>아여기뭐넣지</Text>
      </View>

      {/* 미션 작성 현황 */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

      {/* 매칭 상대 없으면 설문 버튼 */}
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
