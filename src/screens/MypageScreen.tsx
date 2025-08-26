import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import SubmitButton from "../component/SubmitButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { TeamContext } from "./TeamContext";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import styles from "../styles/MypageScreen.syles";
import { ProfileSection } from "../component/ProfileSection";
import { MissionHistorySection } from "../component/MissionHistorySection";
import { SurveyActionSection } from "../component/SurveyActionSection";
import { useSurveyStatus } from "../hooks/useSurveyStatus";
import { useMatchingInfo } from "../hooks/useMatchingInfo";
import { useMissionHistory } from "../hooks/useMissionHistory";

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MypageScreen">;
};

export default function MyPageScreen({ navigation }: MyPageScreenProps) {
  const { teamId, setSubGroupIdMap } = useContext(TeamContext);
  const { userId, name } = useContext(UserContext);
  const isFocused = useIsFocused();

  const { isSurveyCompleted, checkSurveyStatus, setSurveyCompleted } = useSurveyStatus(String(teamId ?? ""), userId ? String(userId) : "", isFocused);
  
  // userId가 null인 경우 로깅
  useEffect(() => {
    console.log("MypageScreen userId 상태:", { userId, userIdType: typeof userId });
  }, [userId]);
  const { matchedNames, subGroupId, fetchSubGroupIdIfNeeded, fetchMatchedNames } = useMatchingInfo(String(teamId ?? ""), String(userId ?? ""), isFocused, setSubGroupIdMap);
  const { missionHistory, fetchMissionHistory } = useMissionHistory(String(teamId ?? ""), isFocused);

  useEffect(() => { 
    // 모든 초기 데이터 로드
    checkSurveyStatus();
    fetchSubGroupIdIfNeeded();
    fetchMatchedNames();
    fetchMissionHistory();
    
    // 설문 상태를 더 자주 확인
    // const interval = setInterval(checkSurveyStatus, 5000);
    // return () => clearInterval(interval);
  }, [checkSurveyStatus, fetchSubGroupIdIfNeeded, fetchMatchedNames, fetchMissionHistory]);

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
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => navigation.navigate("SettingScreen")}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>

        <ProfileSection name={name} matchedNames={matchedNames} />

        <MissionHistorySection missionHistory={missionHistory} />

        <SurveyActionSection matchedNames={matchedNames} isSurveyCompleted={isSurveyCompleted} navigation={navigation} />
      </ScrollView>
    </View>
  );
}
