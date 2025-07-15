import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { TeamContext } from "../screens/TeamContext";
import MissionBox from "../component/MissionBox";
import api from "../api/apiClient";

const BOX_SIZE = 120;
const BOX_MARGIN = 6;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

export default function MissionScreen() {
  const { teamId } = useContext(TeamContext);
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


useEffect(() => {
    if (!teamId) return;

    // 팀 미션 목록 API 호출
    api.get(`/api/missions/team/${teamId}`)
      .then((res) => {
        setMissions(res.data);
      })
      .catch((err) => {
        console.error("미션 불러오기 실패:", err);
      });
  }, [teamId]);



  const handleBoxPress = (index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  };

 const handleComplete = () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];
    console.log(`미션 ${mission.title} 완료`);
    setModalVisible(false);
    // TODO: 완료 API 호출 등 추가 가능
  };


  const handleRefresh = (index: number) => {
    const mission = missions[index];
    console.log(`미션 ${mission.title} 새로고침`);
    // TODO: 새로고침 API 호출 등 실제 로직 작성
  };

   // 학점별 미션 분류
  const missionsByScore = (score: number) =>
    missions.filter((m) => m.score === score);


 return (
    <ScrollView contentContainerStyle={styles.container}>
      {[1, 3, 5, 10].map((score) => (
        <View key={score} style={styles.section}>
          <Text style={styles.title}>{score}학점</Text>
          <View style={styles.grid}>
            {missionsByScore(score).map((mission, i) => (
              <TouchableOpacity
                key={`${score}-credit-${mission.missionId}`}
                style={styles.box}
                onPress={() => handleBoxPress(missions.indexOf(mission))}
              >
                {/* 미션 타이틀 등 표시 */}
                <Text style={{ padding: 10 }}>{mission.description}</Text>

                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={() => handleRefresh(missions.indexOf(mission))}
                >
                  <Text style={styles.refreshText}>↻</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* ✅ 모달 */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>이 미션을 완료하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <Button title="완료" onPress={handleComplete} />
              <Button
                title="취소"
                color="gray"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // 기존 스타일 유지
  container: {
    marginTop: 50,
    paddingVertical: 20,
    alignItems: "center",
  },
  section: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    backgroundColor: "#FFC0C0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: "bold",
    marginBottom: 12,
  },
  grid: {
    width: GRID_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ddd",
    margin: BOX_MARGIN,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 280,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  refreshButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#eee",
    padding: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  refreshText: {
    fontSize: 12,
  },
});