import React, { useEffect, useState, useContext } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "../api/apiClient";
import { TeamContext } from '../screens/TeamContext';

type Member = {
  userId: number;
  userName: string;
  surveyCompleted: boolean;
};

export default function CheckScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const { teamId } = useContext(TeamContext);

  useEffect(() => {
    if (!teamId) return;

    const fetchMembers = async () => {
      try {
        const response = await api.get(`/api/team/${teamId}/survey-status/all`);
        // response.data가 SurveyStatusDto[] 형태라고 가정
        setMembers(response.data);
        console.log(response);
      } catch (error) {
        console.error("팀원 설문 상태 조회 실패", error);
      }
    };

    fetchMembers();
  }, [teamId]);

    // 매칭 시작 API 호출 함수
  const handleStartMatching = async () => {
    if (!teamId) {
      alert("팀 정보가 없습니다.");
      return;
    }

    // 모든 팀원이 설문 완료했는지 체크 (필요하면)
    const allCompleted = members.every((member) => member.surveyCompleted);
    if (!allCompleted) {
      alert("모든 팀원이 설문을 완료해야 매칭을 시작할 수 있습니다.");
      return;
    }

    try {
      const response = await api.post(`/api/matching/start/${teamId}`);
      console.log("매칭 시작 결과:", response.data);
      alert("매칭이 시작되었습니다!");
      // TODO: 필요 시 결과 화면 이동 또는 상태 업데이트
    } catch (error) {
      console.error("매칭 시작 실패", error);
      alert("매칭 시작 중 오류가 발생했습니다.");
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
              <Text style={styles.avatarText}>
                {item.userName.charAt(0)}
              </Text>
            </View>
            <Text style={styles.name}>{item.userName}</Text>
              <Text style={styles.checkbox}>
              {item.surveyCompleted ? "✅" : "⬜️"}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleStartMatching}>
      <Text style={styles.buttonText}>매칭시작하기</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fafafa",
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
    // backgroundColor: "#fff0ff",
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
});
