import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { TeamResponseDto } from "../types/team";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";

type MainHomeScreenNavigationProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MainHomeScreen">;
};

const windowWidth = Dimensions.get("window").width;

type Role = "MEMBER" | "LEADER";

interface Team {
  id: number;
  teamName: string;
  role: Role;
}

// + 버튼 포함된 전체 렌더링 타입
type TeamCardItem = Team | { id: "add-button" };

export default function MainHomeScreen({
  navigation,
}: MainHomeScreenNavigationProp) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { setTeamId, setRole } = useContext(TeamContext);

  useEffect(() => {
    fetchUserTeams();
  }, []);

  const fetchUserTeams = async () => {
    try {
      const response = await api.get<TeamResponseDto[]>("/api/team/mine");
      // teamId(Long)를 string id로 변환하여 맞춰줌

      const mappedTeams = response.data.map((team) => ({
        id: team.teamId, // number
        teamName: team.teamName,
        role: team.role,
      }));

      setTeams(mappedTeams);
    } catch (error) {
      console.error("팀 목록 불러오기 실패", error);
      Alert.alert("오류", "팀 목록을 불러오는데 실패했습니다.");
    }
  };

  const renderTeamCard = ({ item }: { item: Team }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => {
        console.log(
          `선택한 팀 ID: ${item.id}, 팀 이름: ${item.teamName}, role: ${item.role}`
        );
        setTeamId(item.id);
        setRole(item.role);
        navigation.navigate("HomeScreen", { teamId: item.id });
      }}
    >
      <Text style={styles.teamName}>{item.teamName}</Text>
    </TouchableOpacity>
  );

  const renderAddCard = () => (
    <TouchableOpacity
      style={styles.addCard}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.addText}>+</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: TeamCardItem }) => {
    if (item.id === "add-button") {
      return renderAddCard();
    }
    return renderTeamCard({ item: item as Team });
  };

  // 모달에서 팀 생성하기 누르면 이동
  const handleCreateTeam = () => {
    setModalVisible(false);
    navigation.navigate("InviteScreen"); // 실제 네비게이션 이름 확인 후 수정하세요
  };

  // 모달에서 팀 참여하기 누르면 이동
  const handleJoinTeam = () => {
    setModalVisible(false);
    navigation.navigate("JoinScreen"); // 실제 네비게이션 이름 확인 후 수정하세요
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 170, justifyContent: "center" }}>
        <FlatList
          horizontal
          data={[...teams, { id: "add-button" }]}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            alignItems: "center",
          }}
        />
      </View>

      {/* 팀 추가 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCreateTeam}
            >
              <Text style={styles.modalButtonText}>팀 생성하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleJoinTeam}
            >
              <Text style={styles.modalButtonText}>팀 참여하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  teamCard: {
    width: windowWidth * 0.6,
    height: 150,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3, // Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addCard: {
    width: windowWidth * 0.6,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 24,
    color: "#aaa",
  },

  // 여기에 모달 관련 스타일 추가
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // 반투명 검은 배경
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: windowWidth * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: "center",
  },
  cancelButton: {
    borderBottomWidth: 0,
  },
  cancelButtonText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});
