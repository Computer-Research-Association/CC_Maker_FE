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

      <TouchableOpacity style={styles.button} onPress={() => {
        // 여기에 매칭 시작하기 로직 혹은 네비게이션 추가
      }}>
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
