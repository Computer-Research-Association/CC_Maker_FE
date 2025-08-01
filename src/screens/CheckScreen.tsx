import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { TeamContext } from "../screens/TeamContext";
import { UserContext } from "./UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "../component/SubmitButton";
import styles from "../styles/CheckScreenStyles";

import { MatchingService } from "../services/MatchingService";
import { TeamStateManager } from "../managers/TeamStateManager";
import { MatchingFlowController } from "../controllers/MatchingFlowController";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CheckScreen">;
};

type Member = {
  userId: number;
  userName: string;
  surveyCompleted: boolean;
};

export default function CheckScreen({ navigation }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState<"idle" | "loading" | "done">("idle");

  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId } = useContext(UserContext);

  const stateManager = new TeamStateManager(setSubGroupIdMap);

  // ✅ 1. subGroupId (동기화)(초기 데이터 가져오기)
  useEffect(() => {
    if (!teamId || !userId) return;
    //UI와 API통신을 분리, 재사용가능
    MatchingService.getSubGroupId(teamId, userId)
      .then((subId) => {
        //상태 전역변수같은거 업데이트(내부구조 몰라도 상관X)
        stateManager.update(teamId, subId);
        console.log("subGroupId 업데이트:", subId);
      })
      .catch((err) => {
        stateManager.update(teamId, null);
        console.error("subGroupId 조회 실패:", err);
      });
  }, [teamId, userId]);

  // ✅ 2. 팀원 & 매칭여부 상태 fetch
  useEffect(() => {
    if (!teamId) return;
    const fetchData = async () => {
      try {
        const res1 = await MatchingService.getSurveyStatus(teamId);
        const res2 = await MatchingService.getTeam(teamId);
        setMembers(res1.data);
        setIsMatchingStarted(res2.data.matchingStarted);
      } catch (err) {
        console.error("팀 상태 조회 실패:", err);
      }
    };
    fetchData();
  }, [teamId, subGroupIdMap]);

  // ✅ 3. 매칭 시작
  const handleStartMatching = async () => {
    if (!teamId || !userId) return;

    if (isMatchingStarted) {
      alert("이미 매칭이 완료되었습니다.");
      return;
    }

    const allDone = members.every((m) => m.surveyCompleted);
    if (!allDone) {
      alert("모든 팀원이 설문을 완료해야 매칭을 시작할 수 있습니다.");
      return;
    }

    setMatchingStatus("loading");
    //매칭 + 소그룹 조회 + 미션부여 를 절차적으로 묵어서 실행 
    const controller = new MatchingFlowController(teamId, userId, (subId) => {
      stateManager.update(teamId, subId);
    });
    //실제 매칭 + 소그룹 + 미션 부여
    const result = await controller.execute();

    if (result === "done") {
      setTimeout(() => setMatchingStatus("done"), 1200);
    } else {
      setMatchingStatus("idle");
      alert("매칭 실패");
    }
  };
  //멤버 리스트 렌더링
  const sortedMembers = [...members].sort((a, b) => {
    return a.surveyCompleted === b.surveyCompleted
      ? 0
      : a.surveyCompleted
      ? 1
      : -1;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.role}>팀원 설문 상태</Text>
      <Text style={styles.count}>{members.length}명</Text>

      <FlatList
        data={sortedMembers}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <View>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.listItem}>
              <Text style={styles.name}>{item.userName}</Text>
              <Ionicons
                name={item.surveyCompleted ? "checkmark-circle" : "ellipse-outline"}
                size={90}
                color={item.surveyCompleted ? "#50B889" : "#ccc"}
                style={styles.checkbox}
              />
            </View>
          </View>
        )}
      />

      {/* 로딩 모달 */}
      <Modal transparent visible={matchingStatus === "loading"} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>⏳ 매칭 중입니다...</Text>
          </View>
        </View>
      </Modal>

      {/* 완료 모달 */}
      <Modal transparent visible={matchingStatus === "done"} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalText, { color: "green", marginBottom: 16 }]}>
              ✅ 매칭이 완료되었습니다!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setMatchingStatus("idle");
                navigation.navigate("HomeScreen", { teamId: teamId! });
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SubmitButton
        title="매칭시작하기"
        onPress={handleStartMatching}
        style={{ marginBottom: 40 }}
        buttonColor="#FF9898"
        shadowColor="#E08B8B"
      />
    </View>
  );
}
