import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { UserContext } from "./UserContext"; // UserContext 경로에 맞게 수정
import Ionicons from "react-native-vector-icons/Ionicons";
import SubmitButton from "../component/SubmitButton";
import styles from "../styles/CheckScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { teamId, subGroupIdMap, setSubGroupIdMap } = useContext(TeamContext);
  const { userId } = useContext(UserContext); // userId 받아오기
  const [matchingStatus, setMatchingStatus] = useState<
    "idle" | "loading" | "done"
  >("idle");

  // 0. 팀 아이디 변경 시 최신 subGroupId 받아오기
  useEffect(() => {
    if (!teamId) return;
    if (!userId) {
      console.warn("UserId가 없습니다. 로그인 상태를 확인하세요.");
      return;
    }
    const fetchSubGroupId = async () => {
      try {
        const response = await api.get(`/api/matching/subgroup/${teamId}`, {
          params: { userId },
        });

        //const response = await api.get(`/api/matching/subgroup/${teamId}`);
        const subGroupId = response.data.subGroupId ?? null;

        setSubGroupIdMap((prev) => ({
          ...prev,
          [teamId]: subGroupId,
        }));

        console.log("최신 subGroupId 업데이트됨:", subGroupId);
      } catch (error) {
        console.error("subGroupId 조회 실패", error);
        setSubGroupIdMap((prev) => ({
          ...prev,
          [teamId]: null,
        }));
      }
    };

    fetchSubGroupId();
  }, [teamId, userId, setSubGroupIdMap]);

  // 1. subGroupId가 없을 때 => 매칭 전 팀 멤버 조회 및 매칭 시작 여부 조회
  useEffect(() => {
    if (!teamId) return;
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status/all`);
        setMembers(response.data);

        const teamResponse = await api.get(`/api/team/${teamId}`);
        setIsMatchingStarted(teamResponse.data.matchingStarted);
      } catch (error) {
        console.error("팀원 설문 상태 조회 실패", error);
      }
    };

    fetchMembers();
  }, [teamId, subGroupIdMap]);

  // 매칭 시작 API 호출 함수
  const handleStartMatching = async () => {
    if (isMatchingStarted) {
      alert("이미 매칭이 되었습니다.");
      return;
    }

    if (!teamId) {
      alert("팀 정보가 없습니다.");
      return;
    }

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const allCompleted = members.every((member) => member.surveyCompleted);
    if (!allCompleted) {
      alert("모든 팀원이 설문을 완료해야 매칭을 시작할 수 있습니다.");
      return;
    }

    try {
      setMatchingStatus("loading");

      const response = await api.post(`/api/matching/start/${teamId}`);

      console.log("매칭 시작 결과:", response.data);

      if (response.data && response.data.matchingStarted) {
        setIsMatchingStarted(true);
        await AsyncStorage.setItem(`@matching_started_team_${teamId}`, "true");

        alert("매칭이 완료되었습니다!");

        // 서브그룹 아이디 가져오기 및 미션 부여 처리 (임시 userId 사용)
        const subgroupResponse = await api.get(
          `/api/matching/subgroup/${teamId}`,
          { params: { userId } }
        );

        const newSubGroupId = subgroupResponse.data.subGroupId;

        if (newSubGroupId) {
          setSubGroupIdMap((prev) => ({
            ...prev,
            [teamId]: newSubGroupId,
          }));
          console.log("서브 그룹 값 업데이트 되었습니다.");

          try {
            await api.post(`/api/missions/assign/subgroup/${newSubGroupId}`);
            alert("그룹 미션이 부여되었습니다!");
          } catch (missionError) {
            console.error("미션 부여 실패", missionError);
            alert("미션 부여 중 오류가 발생했습니다.");
          }
        }

        setTimeout(() => {
          setMatchingStatus("done");
        }, 2000);
      } else {
        alert("매칭이 시작되지 않았습니다.");
        setMatchingStatus("idle");
      }
    } catch (error: any) {
      setMatchingStatus("idle");
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("매칭 시작 중 오류가 발생했습니다.");
      }
    }
  };

  // surveyCompleted가 false인 사람이 먼저 오게
  const sortedMembers = [...members].sort((a, b) => {
    if (a.surveyCompleted === b.surveyCompleted) return 0;
    return a.surveyCompleted ? 1 : -1;
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
            {index !== 0 && <View style={styles.divider} />}
            <View style={styles.listItem}>
              <Text style={styles.name}>{item.userName}</Text>
              <Ionicons
                name={
                  item.surveyCompleted ? "checkmark-circle" : "ellipse-outline"
                }
                size={90}
                color={item.surveyCompleted ? "#50B889" : "#ccc"}
                style={styles.checkbox}
              />
            </View>
          </View>
        )}
      />

      <Modal
        transparent
        visible={matchingStatus === "loading"}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}> 매칭 중입니다...</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={matchingStatus === "done"}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text
              style={[styles.modalText, { color: "green", marginBottom: 16 }]}
            >
              매칭이 완료되었습니다!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setMatchingStatus("idle");
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "HomeScreen",
                      params: { teamId: teamId! },
                    },
                  ],
                });
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 70,
//   },
//   role: {
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   count: {
//     textAlign: "right",
//     paddingTop: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     marginRight: 12,
//   },
//   listContainer: {
//     borderRadius: 10,
//     paddingBottom: 100,
//   },
//   listItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
//   name: {
//     flex: 1,
//     fontSize: 16,
//   },
//   checkbox: {
//     fontSize: 26,
//     color: "purple",
//   },
//   button: {
//     position: "absolute",
//     bottom: 20,
//     alignSelf: "center",
//     backgroundColor: "#ff9494",
//     paddingHorizontal: 100,
//     paddingVertical: 14,
//     borderRadius: 12,
//     elevation: 2,
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     backgroundColor: "white",
//     padding: 30,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   modalButton: {
//     backgroundColor: "#8de969",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginHorizontal: 12,
//     marginVertical: 4,
//   },
// });
