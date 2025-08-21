import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import SubmitButton from "../component/SubmitButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
//@ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/apiClient";
import { TeamContext } from "./TeamContext";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import styles from "../styles/MypageScreen.syles";
import { getMissionHistoryByUser, getMissionHistoryByTeam } from "../api/missionApi";
import { MissionHistory } from "../types/mission";


type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};



export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const [matchedNames, setMatchedNames] = useState<string[]>([]);
  const [missionHistory, setMissionHistory] = useState<MissionHistory[]>([]);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId, name } = useContext(UserContext);
  const isFocused = useIsFocused();

  const subGroupId = teamId ? subGroupIdMap[teamId] : null;

  // 사용자의 설문 완료 상태 확인
  useEffect(() => {
    if (!teamId || !userId || !isFocused) return;
    
    const checkSurveyStatus = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status/all`);
        const userStatus = response.data.find((member: any) => member.userId === userId);
        if (userStatus) {
          setIsSurveyCompleted(userStatus.surveyCompleted);
        }
      } catch (error) {
        console.error("설문 상태 조회 실패", error);
      }
    };

    checkSurveyStatus();
  }, [teamId, userId, isFocused]);

  //  subGroupId 확인 및 저장
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

  //  매칭된 멤버 이름 불러오기
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

  //  완료된 미션 히스토리 불러오기 (팀 전체)
  useEffect(() => {
    if (!teamId || !isFocused) return;
    const fetchMissionHistory = async () => {
      try {
        console.log("팀 전체 미션 히스토리 조회 시작 - teamId:", teamId);
        const histories = await getMissionHistoryByTeam(teamId);
        console.log("팀 전체 미션 히스토리 조회 결과:", histories);
        
        // 각 미션의 matchedNames 확인
        histories?.forEach((mission: MissionHistory, index: number) => {
          console.log(`미션 ${index + 1}:`, {
            userName: mission.userName,
            matchedNames: mission.matchedNames,
            subGroupName: mission.subGroupName
          });
        });
        
        setMissionHistory(histories || []);
      } catch (error) {
        console.error("팀 전체 미션 히스토리 조회 실패", error);
        // 오류가 발생해도 빈 배열로 설정하여 앱이 크래시되지 않도록 함
        setMissionHistory([]);
      }
    };
    fetchMissionHistory();
  }, [teamId, isFocused]);

  // 미션 점수에 따른 아이콘 반환
  const getIconName = (score: number) => {
    switch (score) {
      case 1:
        return "star-outline";
      case 3:
        return "heart-outline";
      case 5:
        return "diamond-outline";
      case 10:
        return "trophy-outline";
      default:
        return "star-outline";
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        contentInsetAdjustmentBehavior="automatic"
      >
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
                                                                                                                       <Image 
                   source={require('../../assets/user (2).png')} 
                   style={[styles.avatar, { opacity: 0.3, width: 60, height: 60 }]} 
                 />
              <Text style={styles.profileName}>{name || "사용자"}</Text>
            </View>

            {/* 매칭된 멤버들 표시  3명 4명일때도 표시되게 수정 0812*/}
            {matchedNames.length > 0 ? (
              <View style={styles.matchedMembersContainer}>
                {matchedNames.map((memberName, index) => (
                  <View key={index} style={styles.matchedMemberItem}>
                    {/* 하트 아이콘 */}
                    <View style={styles.heartContainer}>
                      <Image 
                        source={require('../../assets/free-icon-hearts-18745836.png')} 
                        style={styles.heartIcon} 
                      />
        </View>

                                                                                                                                                                       {/* 매칭된 멤버 프로필 */}
                       <View style={styles.matchedProfileBlock}>
                                                 <Image 
                          source={require('../../assets/user (2).png')} 
                          style={[styles.matchedAvatar, { opacity: 0.3, width: 60, height: 60 }]} 
                        />
                         <Text style={styles.matchedProfileName}>
                           {memberName}
                         </Text>
                       </View>
                  </View>
                ))}
              </View>
            ) : (
                                                                                                                       <View style={styles.matchedProfileBlock}>
                                       <Image 
                      source={require('../../assets/user (2).png')} 
                      style={[styles.matchedAvatar, { opacity: 0.3, width: 60, height: 60 }]} 
                    />
                   <Text style={styles.matchedProfileName}>
                     매칭 대기중
                   </Text>
                 </View>
          )}
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
            {missionHistory.length > 0 ? (
              missionHistory.map((mission, index) => (
                <View key={mission.id} style={styles.missionItem}>
                  {/* 미션 아이콘 */}
                  <View style={[
                    styles.missionIcon,
                    styles.completedIcon
                  ]}>
                    <Ionicons 
                      name={getIconName(mission.missionScore)} 
                      size={16} 
                      color="#fff"
                    />
                  </View>

                  {/* 미션 카드 */}
                   <View style={[
                     styles.missionCard,
                     styles.completedCard
                   ]}>
                         <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.missionTitle}>{mission.userName}</Text>
                        <Image 
                          source={require('../../assets/free-icon-hearts-18745836.png')} 
                          style={{ width: 18, height: 18, marginHorizontal: 8 }}
                        />
                        <Text style={styles.missionTitle}>
                          {mission.matchedNames && mission.matchedNames.length > 0 
                            ? mission.matchedNames.join(" ♥ ")
                            : "매칭 대기중"
                          }
        </Text>
                      </View>
                     <Text style={styles.missionDate}>{formatDate(mission.completedAt)}</Text>
                     <View style={styles.missionDescription}>
                       <Ionicons name="chatbubble-outline" size={14} color="#999" />
                       <Text style={styles.descriptionText}>{mission.missionDescription}</Text>
                     </View>
                     <Text style={styles.descriptionText}>+{mission.missionScore}점</Text>
                   </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Ionicons name="calendar-outline" size={40} color="#ccc" />
                <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>아직 완료된 미션이 없어요</Text>
                <Text style={{ marginTop: 5, fontSize: 14, color: '#999' }}>미션을 완료하면 여기에 기록됩니다!</Text>
              </View>
            )}
          </View>
      </View>

      {/* 매칭 상대 없고 설문이 완료되지 않은 경우에만 설문 버튼 표시 */}
      {matchedNames.length === 0 && !isSurveyCompleted && (
          <View style={{ alignItems: 'center', paddingVertical: 10, marginTop: -30 }}>
            <SubmitButton
              title="설문시작하기"
              onPress={() => navigation.navigate("MbtiScreen")}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              width={300}
              height={50}
              // paddingHorizontal={30}
              // paddingVertical={15}
            />
        </View>
      )}

      {/* 설문이 완료된 경우 안내 메시지 표시 */}
      {matchedNames.length === 0 && isSurveyCompleted && (
        <View style={{ alignItems: 'center', paddingVertical: 10, marginTop: -30 }}>
          <View style={{ 
            backgroundColor: '#f0f0f0', 
            padding: 20, 
            borderRadius: 10, 
            alignItems: 'center',
            width: 300
          }}>
            <Ionicons name="checkmark-circle" size={24} color="#50B889" />
            <Text style={{ 
              marginTop: 8, 
              fontSize: 16, 
              color: '#666', 
              textAlign: 'center' 
            }}>
              설문조사가 완료되었습니다
            </Text>
            <Text style={{ 
              marginTop: 4, 
              fontSize: 14, 
              color: '#999', 
              textAlign: 'center' 
            }}>
              매칭 결과를 기다려주세요
            </Text>
          </View>
        </View>
      )}
      </ScrollView>
    </View>
  );
}
