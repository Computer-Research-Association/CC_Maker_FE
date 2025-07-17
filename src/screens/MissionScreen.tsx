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
  const { teamId, subGroupIdMap } = useContext(TeamContext);
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // teamId가 있을 때 subGroupId 뽑기
  const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;

  useEffect(() => {
    if (!teamId || !subGroupId) return;

    console.log("subGroupId:", subGroupId);
    // 팀 미션 목록 API 호출
    api.get(`/api/missions/subgroup/${subGroupId}`)
      .then((res) => {
        setMissions(res.data);
      })
      .catch((err) => {
        console.error("미션 불러오기 실패:", err);
      });
  }, [teamId, subGroupId]);

  const handleBoxPress = (index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  };

  // 미션 완료 관리
  const handleComplete = async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];

    try {
      await api.post("/api/missions/complete", {
        teamId,
        subGroupId,
        missionId: mission.missionTemplateId,
      });
      alert(`${mission.title} 미션이 완료 처리되었습니다.`);

      // 완료 상태 갱신을 위해 미션 리스트 재조회
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      console.error("미션 완료 처리 실패:", error);
      alert("미션 완료 처리에 실패했습니다.");
    } finally {
      setModalVisible(false);
    }
  };

  // 미션 새로고침
  const handleRefresh = async (index: number) => {
    const mission = missions[index];

    try {
      await api.post(
        `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
      );
      alert(`${mission.title} 미션이 새로고침되었습니다.`);

      // 새로고침 후 미션 리스트 갱신
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      console.error("미션 새로고침 실패:", error);
      alert("미션 새로고침에 실패했습니다.");
    }
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
                key={`${score}-credit-${mission.subGroupMissionId}`}
                style={styles.box}
                onPress={() => handleBoxPress(missions.indexOf(mission))}
              >
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
