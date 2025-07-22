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
            <Text style={styles.title}>팀을 선택해주세요</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.createButton]}
              onPress={handleCreateTeam}
            >
              <Text style={styles.modalButtonText}>팀 생성하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.joinButton]}
              onPress={handleJoinTeam}
            >
              <Text style={styles.modalButtonText}>팀 참여하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
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
    elevation: 3,
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

  // 모달 관련 스타일
  title: {
    color: "#111", // ⭐ 좀 더 진한 블랙톤
    fontSize: 20, // ⭐ 약간 키움
    textAlign: "center",
    fontWeight: "600", // ⭐ 강조
    marginBottom: 16, // ⭐ 여백 추가
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: windowWidth * 0.8,
    backgroundColor: "white",
    borderRadius: 20, // ⭐ 둥글게
    padding: 24, // ⭐ 더 넉넉하게
    shadowColor: "#000", // ⭐ 그림자 추가
    shadowOpacity: 0.2, // ⭐
    shadowOffset: { width: 0, height: 4 }, // ⭐
    shadowRadius: 10, // ⭐
    elevation: 10, // ⭐ Android
  },
  modalButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // ⭐ 더 연한 선
    alignItems: "center", // ⭐ 가운데 정렬 확실하게
    flexDirection: "row", // ⭐ 아이콘 배치용
    justifyContent: "center", // ⭐
    gap: 8, // ⭐ 아이콘과 텍스트 간격 (RN 0.71 이상에서만 지원)
  },
  modalButtonText: {
    fontSize: 17, // ⭐ 살짝 줄임
    color: "#fff", // ⭐ 좀 더 현대적인 텍스트 색
  },
  createButton: {
    backgroundColor: "#ffd1d1",
    borderRadius: 12, // 둥글게
    marginBottom: 7, // 버튼 간격
    fontWeight: "bold",
  }, // ⭐ create 버튼용
  joinButton: {
    backgroundColor: "#ffe3e1",
    borderRadius: 12,
    marginBottom: 10,
    fontWeight: "bold",
  }, // ⭐ join 버튼용
  cancelButton: {
    borderBottomWidth: 0,
    marginTop: 12, // ⭐ 여백
  },
  cancelButtonText: {
    color: "#FF3B30", // ⭐ iOS 스타일 빨간색
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500", // ⭐ 더 가볍고 세련되게
  },
});
