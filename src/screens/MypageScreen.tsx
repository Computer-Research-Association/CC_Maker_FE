import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import styles from "../styles/MypageScreen.syles";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";
import { TeamContext } from "./TeamContext";
import { useIsFocused } from "@react-navigation/native";

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState<boolean>(false);
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);

  const month = "7월";
  const writtenCount = 0;
  const isFocused = useIsFocused();

  // teamId가 있을 때 subGroupId 뽑기
  const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;

  useEffect(() => {
    if (!teamId || !isFocused) return;

    // subGroupId가 없으면 API 호출로 최신화
    const fetchSubGroupIdIfNeeded = async () => {
      if (!subGroupId) {
        try {
          // 임시 유저id, 나중에 삭제 필요
          const response = await api.get(`/api/matching/subgroup/${teamId}`, {
            params: { userId: 1 },
          });
          const newSubGroupId = response.data.subGroupId ?? null;

          setSubGroupIdMap((prev) => {
            if (prev[teamId] === newSubGroupId) return prev; // 중복 방지
            return { ...prev, [teamId]: newSubGroupId };
          });

          console.log("서브그룹 아이디 최신화 완료:", newSubGroupId);
        } catch (error) {
          console.error("subGroupId 조회 실패", error);
        }
      }
    };

    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status`);
        setIsSurveyCompleted(response.data.issurveycompleted);
      } catch (error) {
        console.error("설문 완료 상태 조회 실패", error);
      }
    };

    const fetchMatchedNames = async () => {
  if (!subGroupId) return;
  try {
    console.log("이름 조회 시도:", subGroupId);
    const response = await api.get(
      `/api/matching/matched-names/${teamId}/${subGroupId}`
    );
    console.log("이름 조회 성공:", response.data);

    // matchedNames 배열만 꺼내서 저장
    setMatchedNames(response.data.matchedNames || []);
  } catch (error) {
    console.error("매칭된 이름 조회 실패", error);
  }
};


    const run = async () => {
      await fetchSubGroupIdIfNeeded();
      await fetchSurveyStatus();
      await fetchMatchedNames();
    };

    run();
  }, [teamId, subGroupId, isFocused]);

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

      <View style={styles.profileRow}>
        <View style={styles.profileBlock}>
          <View style={styles.avatar} />
          <Text style={styles.name}>{teamId}</Text>
        </View>

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

      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.selectedTab]}>다이어리</Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {month} | 완료한 미션개수 {writtenCount}개
        </Text>
      </View>

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
