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
  const [matchingStatus, setMatchingStatus] = useState<
    "idle" | "loading" | "done"
  >("idle");

  // 0. 팀 아이디 변경 시 최신 subGroupId 받아오기
  useEffect(() => {
    if (!teamId) return;

    const fetchSubGroupId = async () => {
      try {
        //나중에 수정하기
        const userId = 1; // 임시 userId
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
  }, [teamId, setSubGroupIdMap]);

  // 1. subGroupId가 있을 때 => 매칭된 이름 조회
  useEffect(() => {
    if (teamId == null || !subGroupIdMap) return;

    const subGroupId = subGroupIdMap[teamId];    
    if (!subGroupId) return;

    const fetchMatchedNames = async () => {
      try {
        const response = await api.get(
          `/api/matching/matched-names/${teamId}/${subGroupId}`
        );
        console.log("팀읽어왔어용")
        setMembers(response.data);
      } catch (error) {
        console.error("매칭된 이름 조회 실패", error);
      }
    };

    fetchMatchedNames();
  }, [teamId, subGroupIdMap]);

  // 2. subGroupId가 없을 때 => 매칭 전 팀 멤버 조회 및 매칭 시작 여부 조회
  useEffect(() => {
    if (!teamId) return;

    if (subGroupIdMap[teamId] !== null) return; // subGroupId가 있으면 여기서 멤버를 안 불러오도록 함

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
        alert("매칭이 완료되었습니다!");

        // 서브그룹 아이디 가져오기 및 미션 부여 처리 (임시 userId 사용)
        const userId = 1;
        const subgroupResponse = await api.get(
          `/api/matching/subgroup/${teamId}?userId=${userId}`
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
        }, 1000);
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

  return (
    <View style={styles.container}>
      <Text style={styles.role}>팀원 설문 상태</Text>
      <Text style={styles.count}>{members.length}명</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{item.userName}</Text>
            <Text style={styles.checkbox}>
              {item.surveyCompleted ? "✅" : "⬜️"}
            </Text>
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
            <Text style={styles.modalText}>⏳ 매칭 중입니다...</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleStartMatching}>
        <Text style={styles.buttonText}>매칭시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  role: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  count: {
    textAlign: "left",
    marginBottom: 12,
    fontSize: 14,
  },
  listContainer: {
    borderRadius: 10,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: "#d1b3ff",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    fontSize: 18,
    color: "purple",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff85d0",
    paddingHorizontal: 100,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#8de969",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
