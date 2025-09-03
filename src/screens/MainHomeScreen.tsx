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
  StatusBar,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { TeamResponseDto } from "../types/team";
import api from "../api/apiClient";
import { TeamContext } from "../screens/TeamContext";
import { SafeAreaView } from "react-native-safe-area-context";
import SubmitButton from "../component/SubmitButton";
import styles from "../styles/MainHomeScreenStyles";

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
  const { setTeamId, setRole, setTeamName } = useContext(TeamContext);

  useEffect(() => {
    console.log("✅ useEffect 실행됨");
    fetchUserTeams();
  }, []);

  const fetchUserTeams = async () => {
    try {
      console.log("passhere");
      const response = await api.get<TeamResponseDto[]>("/api/team/mine");
      console.log("passhere1");
      // teamId(Long)를 string id로 변환하여 맞춰줌
      console.log("여기에요 여기:", response.data);
      // 브랜치 파기용 추가
      const mappedTeams = response.data.map((team) => ({
        id: team.teamId, // number
        teamName: team.teamName,
        role: team.role,
      }));
      console.log("passhere2");

      setTeams(mappedTeams);
    } catch (error) {
      console.log("passhere in catch");

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
        setTeamName(item.teamName);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "HomeScreen",
              params: { teamId: item.id },
            },
          ],
        });
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={true}
      />

      {/* 상단 나가기 버튼 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
              {
                text: "취소",
                style: "cancel",
              },
              {
                text: "로그아웃",
                style: "destructive",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  }),
              },
            ]);
          }}
        >
          <Image
            source={require("../../assets/enter (2).png")}
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlatList
            data={[...teams, { id: "add-button" }]}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 20,
              gap: 15,
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
              {/* <Text style={styles.title}>팀을 선택해주세요</Text> */}

              <SubmitButton
                // style={[styles.modalButton, styles.createButton]}
                title="팀생성하기"
                buttonColor="#FF9898"
                shadowColor="#E08B8B"
                onPress={handleCreateTeam}
              >
                <Text style={styles.modalButtonText}>팀 생성하기</Text>
              </SubmitButton>

              <SubmitButton
                // style={[styles.modalButton, styles.joinButton]}
                title="참여하기"
                buttonColor="#ffd1d1"
                shadowColor="#ffe3e1"
                onPress={handleJoinTeam}
                style={{ marginTop: 7 }}
              >
                {" "}
              </SubmitButton>

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
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },

//   teamCard: {
//     width: windowWidth * 0.6,
//     height: 150,
//     marginHorizontal: 10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//   },
//   teamName: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   addCard: {
//     width: windowWidth * 0.6,
//     height: 150,
//     marginHorizontal: 10,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderStyle: "dashed",
//     borderColor: "#aaa",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addText: {
//     fontSize: 24,
//     color: "#aaa",
//   },

//   // 모달 관련 스타일
//   title: {
//     color: "#111",
//     fontSize: 20,
//     textAlign: "center",
//     fontWeight: "600",
//     marginBottom: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: windowWidth * 0.8,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 10,
//     elevation: 10, //  Android
//   },
//   modalButton: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 8, // 아이콘과 텍스트 간격
//   },
//   modalButtonText: {
//     fontSize: 17,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   // create 버튼
//   createButton: {
//     backgroundColor: "#ffd1d1",
//     borderRadius: 12, // 둥글게
//     marginBottom: 7, // 버튼 간격
//     fontWeight: "bold",
//   },
//   // join 버튼
//   joinButton: {
//     backgroundColor: "#ffe3e1",
//     borderRadius: 12,
//     marginBottom: 10,
//     fontWeight: "bold",
//   },
//   cancelButton: {
//     borderBottomWidth: 0,
//     marginTop: 12,
//   },
//   cancelButtonText: {
//     color: "#FF3B30",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "500",
//   },
// });
