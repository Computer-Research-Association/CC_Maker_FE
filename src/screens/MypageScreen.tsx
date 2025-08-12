import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";
import { TeamContext } from "./TeamContext";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import styles from "../styles/MypageScreen.syles";

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

type MissionHistory = {
  id: number;
  title: string;
  date: string;
  description: string;
  icon: string;
  isCompleted: boolean;
};

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const [missionHistory, setMissionHistory] = useState<MissionHistory[]>([]);
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId, name } = useContext(UserContext);
  const isFocused = useIsFocused();

  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

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

  // ✅ 완료된 미션 히스토리 불러오기
  useEffect(() => {
    if (!teamId || !subGroupId || !isFocused || !userId) return;
    const fetchMissionHistory = async () => {
      try {
        const response = await api.get(
          `/api/missions/completed/${teamId}`,
          {
            params: { userId, subGroupId },
          }
        );
        // 실제 API 응답에 따라 데이터 구조 조정 필요
        const missions = response.data.missions || [];
        setMissionHistory(missions);
      } catch (error) {
        console.error("미션 히스토리 조회 실패", error);
        // 임시 데이터로 표시 (API 연동 후 제거)
        setMissionHistory([
          {
            id: 1,
            title: "첫 데이트 사진 찍기",
            date: "8월 10일",
            description: "카페에서 함께 찍은 첫 사진! ❤️",
            icon: "camera",
            isCompleted: true,
          },
          {
            id: 2,
            title: "함께 요리하기",
            date: "8월 8일",
            description: "파스타 만들기 성공!",
            icon: "search",
            isCompleted: true,
          },
          {
            id: 3,
            title: "영화 보기",
            date: "8월 5일",
            description: "이번 주말에 꼭!",
            icon: "film",
            isCompleted: false,
          },
        ]);
      }
    };
    fetchMissionHistory();
  }, [teamId, subGroupId, isFocused, userId]);

  const getIconName = (iconType: string) => {
    switch (iconType) {
      case "camera":
        return "camera-outline";
      case "search":
        return "search-outline";
      case "film":
        return "film-outline";
      default:
        return "star-outline";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상단 설정 버튼 */}
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => navigation.navigate("SettingScreen")}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>

        {/* 프로필 영역 */}
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            {/* 본인 프로필 */}
            <View style={styles.profileBlock}>
              <View style={styles.avatar} />
              <Text style={styles.profileName}>{name || "사용자"}</Text>
            </View>

            {/* 하트 아이콘 */}
            <View style={styles.heartContainer}>
              <Image 
                source={require('../../assets/free-icon-hearts-18745836.png')} 
                style={styles.heartIcon} 
              />
            </View>

            {/* 매칭된 상대 프로필 */}
            <View style={styles.matchedProfileBlock}>
              <View style={styles.matchedAvatar} />
              <Text style={styles.matchedProfileName}>
                {matchedNames[0] || "매칭 대기중"}
              </Text>
            </View>
          </View>
        </View>

        {/* 미션 히스토리 */}
        <View style={styles.missionHistorySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.sectionTitle}>미션 히스토리</Text>
          </View>

          <View style={styles.timelineContainer}>
            {/* 타임라인 라인 */}
            <View style={styles.timelineLine} />
            
            {/* 미션 항목들 */}
            {missionHistory.map((mission, index) => (
              <View key={mission.id} style={styles.missionItem}>
                {/* 미션 아이콘 */}
                <View style={[
                  styles.missionIcon,
                  mission.isCompleted ? styles.completedIcon : styles.pendingIcon
                ]}>
                  <Ionicons 
                    name={getIconName(mission.icon)} 
                    size={16} 
                    color={mission.isCompleted ? "#fff" : "#999"} 
                  />
                </View>

                {/* 미션 카드 */}
                <View style={[
                  styles.missionCard,
                  mission.isCompleted ? styles.completedCard : styles.pendingCard
                ]}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDate}>{mission.date}</Text>
                  <View style={styles.missionDescription}>
                    <Ionicons name="chatbubble-outline" size={14} color="#999" />
                    <Text style={styles.descriptionText}>{mission.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
