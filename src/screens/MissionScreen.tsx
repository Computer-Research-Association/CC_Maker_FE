import React, { useContext, useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { TeamContext } from "../screens/TeamContext";
import MissionBox from "../component/MissionBox";
import api from "../api/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";
import SubmitButton from "../component/SubmitButton";

const BOX_SIZE = 108;
const BOX_MARGIN = 4;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

export default function MissionScreen() {
  const { role, teamId, subGroupIdMap, teamName } = useContext(TeamContext);
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;

  useEffect(() => {
    if (!teamId || !subGroupId) return;

    const fetchMissions = async () => {
      try {
        const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
        if (res.data.length === 0) {
          await api.post(`/api/missions/assign/subgroup/${subGroupId}`);
          const newRes = await api.get(`/api/missions/subgroup/${subGroupId}`);
          setMissions(newRes.data);
        } else {
          setMissions(res.data);
        }
      } catch (err) {
        console.error("미션 불러오기 실패:", err);
      }
    };

    fetchMissions();
  }, [teamId, subGroupId]);

  const handleBoxPress = (index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  };

  const handleComplete = async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];
    try {
      await api.post("/api/missions/complete", {
        teamId,
        subGroupId,
        missionId: mission.missionTemplateId,
      });
      setMissions((prev) =>
        prev.map((m, i) =>
          i === selectedBoxIndex ? { ...m, completed: true } : m
        )
      );
    } catch (error) {
      console.error("미션 완료 실패:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const confirmRefresh = async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];
    try {
      await api.post(
        `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
      );
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      console.error("미션 새로고침 실패:", error);
    } finally {
      setConfirmModalVisible(false);
    }
  };

  const missionsByScore = (score: number) =>
    missions.filter((m) => m.score === score);

  if (!teamId || !subGroupId) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.matchingMessage}>매칭을 완료해주세요</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logoText}>
          🌟 {teamName ?? "팀 이름 없음"} 팀 CC 미션
        </Text>
        {[1, 3, 5, 10].map((score) => (
          <View key={score} style={styles.section}>
            <Text style={styles.title}>{score}학점</Text>
            <View style={styles.grid}>
              {missionsByScore(score).map((mission, i) => (
                <TouchableOpacity
                  key={`${score}-${mission.subGroupMissionId}`}
                  style={[styles.box, mission.completed && styles.completedBox]}
                  onPress={() =>
                    !mission.completed &&
                    handleBoxPress(missions.indexOf(mission))
                  }
                  disabled={mission.completed}
                >
                  <Text style={{ textAlign: "center", padding: 10 }}>
                    {mission.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setConfirmModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {confirmModalVisible ? (
              <>
                <Text style={styles.missionTitle}>
                  정말 이 미션을 새로고침할까요?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmRefresh}
                  >
                    <Text style={styles.buttonText}>새로고침</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setConfirmModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (//이 조건을 사용하지않으면 null 오류로 에러가 발생 > 앱 뒤질수도
              <>
                {selectedBoxIndex !== null && (
                  <Text style={styles.missionTitle}>
                    {missions[selectedBoxIndex]?.score}학점
                  </Text>
                )}
                <View style={styles.missionBox}>
                  <View style={styles.missionContentWrapper}>
                    <Text style={styles.missionContent}>
                      {missions[selectedBoxIndex!]?.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => setConfirmModalVisible(true)}
                  >
                    <Text style={styles.refreshText}>↻ 새로고침</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtons}>
                  <SubmitButton
                    title="미션완료"
                    onPress={handleComplete}
                    width={100}
                    height={100}
                    buttonColor="#FF9898"
                    shadowColor="#E08B8B"
                  >
                    <Text style={styles.buttonText}>미션 완료</Text>
                  </SubmitButton>
                  <SubmitButton
                    title="취소"
                    onPress={() => setModalVisible(false)}
                    buttonColor="#bbb"
                    width={100}
                    height={100}
                    shadowColor="#aaa"
                  >
                    <Text style={styles.buttonText}>취소</Text>
                  </SubmitButton>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15, // 여백 여기서 조절
    paddingBottom: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topheader: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "center", // 이미 잘 되어 있음
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start", // 이미 잘 되어 있음
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    width: "100%", // ✅ 또는 alignSelf: "stretch"
  },

  section: {
    marginBottom: 10,
    padding: 16, // 내부 여백
    backgroundColor: "#fff", // 흰색 배경
    borderRadius: 20,
    width: GRID_WIDTH + 15,
    alignItems: "center",

    shadowColor: "#000", // 그림자 색 (iOS)
    shadowOpacity: 0.05, // 투명도 (0~1)
    shadowOffset: { width: 0, height: 4 }, // 그림자 위치
    shadowRadius: 6, // 퍼짐 정도
    elevation: 5, // Android 그림자
  },
  title: {
    // 학점
    backgroundColor: "#FF9494",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ddd",
    margin: BOX_MARGIN,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    gap: 12,
  },
  confirmButton: {
    backgroundColor: "#FF9494", // 코랄색
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2, // 안드로이드 그림자
  },
  cancelButton: {
    backgroundColor: "#bbb", // 회색
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  missionBox: {
    backgroundColor: "#fefefe",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    width: "100%",
    minHeight: 360,
  },

  missionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },

  missionContent: {
    fontSize: 15,
    // color: "#555",
    color: "#333", // 배경과 대비되게
    textAlign: "center",
    lineHeight: 22,
  },

  missionContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  refreshButton: {
    position: "absolute",
    bottom: 6,
    right: 8,
    backgroundColor: "#eee",
    padding: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  refreshText: {
    fontSize: 12,
  },
  completedBox: {
    backgroundColor: "#d3d3d3",
  },
  disabledRefreshButton: {
    opacity: 0.3,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  matchingMessage: {
    fontSize: 24, // ✅ 큰 텍스트
    fontWeight: "600", // ✅ 반굵게
    color: "#999", // ✅ 연한 회색
    textAlign: "center", // ✅ 중앙 정렬
    marginTop: "0%", // ✅ 세로 중앙 근처 배치 (안정적)
    transform: [{ translateY: -10 }], // ✅ 텍스트 높이 보정 (정중앙에 더 가깝게)
  },
});
