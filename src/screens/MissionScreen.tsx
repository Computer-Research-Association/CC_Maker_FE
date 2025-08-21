import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { TeamContext } from "../screens/TeamContext";
import MissionBox from "../component/MissionBox";
import api from "../api/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import SubmitButton from "../component/SubmitButton";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const celebrateKey = (
  teamId?: number | null,
  subGroupId?: number | null,
  min?: number | null
) => `celebrated:${teamId ?? "na"}:${subGroupId ?? "na"}:${min ?? 0}`;

const BOX_SIZE = 108;
const BOX_MARGIN = 4;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

type SubGroupScore = {
  subGroupId: number;
  name: string;
  score: number;
  members: string[];
};

type ScoreboardResponse = {
  minScore: number;
  mySubGroup: SubGroupScore;
  otherSubGroups: SubGroupScore[];
};
export default function MissionScreen() {
  const { role, teamId, subGroupIdMap, teamName } = useContext(TeamContext);
  // 미션 관련 상태
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  // 모달 관련 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [minScore, setMinScore] = useState<string>("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  // 점수판 관련 상태
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [sbLoading, setSbLoading] = useState(false);
  const [sbError, setSbError] = useState<string | null>(null);
  // 축하 메시지 모달 상태
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  // 이전 최소학점을 저장하는 ref
  const prevMinScoreRef = useRef<number | null>(null);

  const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const celebratedMinScoreRef = useRef<number | null>(null);

  //이거 왜필요하노(최소학점설정이 있는지 없는지 파악하기 위해서)
  const fetchScoreboard = useCallback(() => {
    if (!teamId || !userId) return;
    setSbLoading(true);
    api
      .get(`/api/teams/${teamId}/scoreboard`, { params: { userId } })
      .then((res) => {
        setScoreboard(res.data);
        setSbError(null);
      })
      .catch((err) => {
        setScoreboard(null);
        setSbError(err?.message ?? "점수판 불러오기 실패");
      })
      .finally(() => setSbLoading(false));
  }, [teamId, userId]);

  // 미션 불러오기 로직을 useCallback으로 분리
  const fetchMissions = useCallback(async () => {
    if (!teamId || !subGroupId) return;

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
      console.error("❌ 미션 불러오기 실패:", err);
    }
  }, [teamId, subGroupId]);

  // 1) 달성 판정 헬퍼
  const isAchieved = (data: ScoreboardResponse | null) => {
    if (!data) return false;
    const { minScore, mySubGroup } = data;
    return minScore > 0 && (mySubGroup?.score ?? 0) >= minScore;
  };

  //저장소에 최소학점 저장
  const loadCelebration = useCallback(async () => {
    if (!scoreboard || !teamId || !subGroupId) return;
    const key = celebrateKey(teamId, subGroupId, scoreboard.minScore);
    const v = await AsyncStorage.getItem(key);
    celebratedMinScoreRef.current = v ? scoreboard.minScore : null;
  }, [scoreboard?.minScore, teamId, subGroupId]);

  // 2) 미션 완료 핸들러
  const handleComplete = useCallback(async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];

    try {
      // 완료 처리
      await api.post("/api/missions/complete", {
        teamId,
        subGroupId,
        missionId: mission.missionTemplateId,
      });

      // 낙관적 업데이트(선택)
      setMissions(prev =>
        prev.map((m, i) => (i === selectedBoxIndex ? { ...m, completed: true } : m))
      );

      // ⚠️ 캐시 무력화해서 최신 점수판 확보
      const { data: freshSb } = await api.get(`/api/teams/${teamId}/scoreboard`, {
        params: { userId, _ts: Date.now() },
      });
      setScoreboard(freshSb);

      Alert.alert(mission.title, "미션이 완료처리되었습니다.");

      const currentMin = freshSb?.minScore ?? 0;
      const alreadyCelebratedForThisMin =
        celebratedMinScoreRef.current === currentMin;

      if (isAchieved(freshSb) && !alreadyCelebratedForThisMin) {
        setModalVisible(false);               // 상세 모달 먼저 닫고
        celebratedMinScoreRef.current = currentMin;  // 이 최소학점에 대해서는 축하 완료로 기록
        // 저장
        const key = celebrateKey(teamId, subGroupId, currentMin);
        AsyncStorage.setItem(key, "1").catch(() => {});
        setTimeout(() => setShowCongratsModal(true), 0);
      } else {
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("오류", "미션 완료 처리에 실패했습니다.");
    }
  }, [selectedBoxIndex, missions, teamId, subGroupId, userId]);

  // 미션 새로고침 로직을 useCallback으로 분리
  const confirmRefresh = useCallback(async () => {
    if (selectedBoxIndex === null) return;
    const mission = missions[selectedBoxIndex];

    try {
      await api.post(
        `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
      );
      alert(`${mission.title} 미션이 새로고침되었습니다.`);
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      alert("미션 새로고침에 실패했습니다.");
    } finally {
      setConfirmModalVisible(false);
    }
  }, [selectedBoxIndex, missions, subGroupId]);

  // 화면이 포커스될 때마다 데이터 최신화
  useFocusEffect(
    useCallback(() => {
      // 점수판은 항상 최신화 (점수 변경 가능성)
      fetchScoreboard();
      
      // 미션은 변경되지 않았을 가능성이 높으므로 조건부 실행
      if (missions.length === 0) {
        fetchMissions();
      }
      
      // 축하 상태는 최소학점이 변경되었을 때만
      if (scoreboard?.minScore !== prevMinScoreRef.current) {
        loadCelebration();
      }
    }, [fetchScoreboard, fetchMissions, loadCelebration, missions.length, scoreboard?.minScore])
  );

  const handleBoxPress = (index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  };

  const missionsByScore = (score: number) =>
    missions.filter((m) => m.score === score);

  if (!teamId || !subGroupId) {
    return (
      <View style={styles.container}>
        <View style={styles.matchingWaitContainer}>
          <View style={styles.matchingIconContainer}>
            <Image
              source={require("../../assets/free-icon-hearts-18745836.png")}
              style={styles.matchingIcon}
            />
          </View>
          <Text style={styles.matchingTitleText}>
            매칭을 먼저 진행해주세요.
          </Text>
          <Text style={styles.matchingSubText}>
            미션을 시작하기 전에 매칭 과정을 완료해야 합니다.
          </Text>
        </View>
      </View>
    );
  }

  if (!scoreboard) {
    return (
      <View style={styles.container}>
        <View style={styles.matchingWaitContainer}>
          <View style={styles.matchingIconContainer}>
            <Image
              source={require("../../assets/free-icon-hearts-18745836.png")}
              style={styles.matchingIcon}
            />
          </View>
          <Text style={styles.matchingTitleText}>최소학점을 설정해주세요</Text>
          <Text style={styles.matchingSubText}>
            미션을 시작하기 전에 최소학점을 설정해야 합니다.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f7f8fa" }}
      edges={["bottom"]}
    >
      <View style={styles.topheader} />

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>
            {teamName ?? "팀 이름이 없습니다"} 팀 CC 미션
          </Text>
        </View>

        {[1, 3, 5, 10].map((score) => (
          <View key={score} style={styles.section}>
            <Text style={styles.title}>{score}학점</Text>
            <View style={styles.grid}>
              {missionsByScore(score).map((mission, i) => (
                <TouchableOpacity
                  key={`${score}-credit-${mission.subGroupMissionId}`}
                  style={[styles.box, mission.completed && styles.completedBox]}
                  onPress={() =>
                    !mission.completed &&
                    handleBoxPress(missions.indexOf(mission))
                  }
                  disabled={mission.completed}
                >
                  <Text style={styles.missionBoxText}>
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
                  <SubmitButton
                    title="아니오"
                    onPress={() => setConfirmModalVisible(false)}
                    buttonColor="#bbb"
                    shadowColor="#aaa"
                    width={120}
                    height={50}
                    style={{ marginTop: 5, marginLeft: 10 }}
                  />
                  <SubmitButton
                    title="새로고침"
                    onPress={confirmRefresh}
                    buttonColor="#FF9898"
                    shadowColor="#E08B8B"
                    width={120}
                    height={50}
                    style={{ marginTop: 5 }}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.missionTitle}>
                  {missions[selectedBoxIndex!]?.score}학점
                </Text>
                <LinearGradient
                  colors={["#ffe5ec", "#ffd6e0", "#fff0f5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.missionBox}
                >
                  <View style={styles.glassOverlay} />
                  <View style={styles.missionContentWrapper}>
                    <Text style={styles.missionContent}>
                      {selectedBoxIndex !== null
                        ? missions[selectedBoxIndex].description
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => setConfirmModalVisible(true)}
                    disabled={
                      selectedBoxIndex === null ||
                      missions[selectedBoxIndex].completed
                    }
                  >
                    <Text style={styles.refreshText}>↻ 새로고침</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <View style={styles.modalButtons}>
                  <SubmitButton
                    title="취소"
                    onPress={() => setModalVisible(false)}
                    buttonColor="#bbb"
                    width={120}
                    height={50}
                    shadowColor="#aaa"
                    style={{ marginLeft: 10 }}
                  ></SubmitButton>

                  <SubmitButton
                    title="미션완료"
                    onPress={handleComplete}
                    width={120}
                    height={50}
                    buttonColor="#FF9898"
                    shadowColor="#E08B8B"
                  ></SubmitButton>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 축하 메시지 모달 */}
      <Modal
        visible={showCongratsModal}
        onRequestClose={() => setShowCongratsModal(false)}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: "center" }]}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#ff6b6b' }}>
              축하합니다! 
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 }}>
              최소학점을 달성했습니다!
            </Text>
            <SubmitButton
              title="확인"
              onPress={() => setShowCongratsModal(false)}
              buttonColor="#FF9898"
              shadowColor="#E08B8B"
              width={120}
              height={50}
              style={{ marginTop: 5 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 0,
  },
  topheader: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start", // 이미 잘 되어 있음
    justifyContent: "center",
    backgroundColor: "#f7f8fa",
  },

  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start", // 이미 잘 되어 있음
    justifyContent: "center",
    backgroundColor: "#f7f8fa",
  },

  logoText: {
    fontSize: 24,
    fontFamily: "Ongeulip",
    color: "#333",
    textAlign: "left",
    width: "100%", // ✅ 또는 alignSelf: "stretch"
  },

  section: {
    marginBottom: 10,
    padding: 16, // 내부 여백
    backgroundColor: "#fff", // 카드 배경은 흰색 유지
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
    fontFamily: "Ongeulip",
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
    fontFamily: "Ongeulip",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
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
    fontFamily: "Ongeulip",
    fontSize: 16,
    textAlign: "center",
  },
  missionBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#FF8CC6",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 12,
    width: "100%",
    minHeight: 360,
    overflow: "hidden",
    position: "relative",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff6",
    shadowColor: "#ff9ce5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    zIndex: -1,
  },

  missionTitle: {
    fontSize: 16,
    fontFamily: "Ongeulip",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },

  missionContent: {
    fontSize: 15,
    // color: "#555",
    color: "#333", // 배경과 대비되게
    textAlign: "center",
    fontFamily: "Ongeulip",
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
    fontFamily: "Ongeulip",
    fontSize: 12,
  },
  missionBoxText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "Ongeulip",
    fontSize: 14,
    color: "#333",
  },
  completedBox: {
    backgroundColor: "#d3d3d3",
  },
  disabledRefreshButton: {
    opacity: 0.3,
  },
  // 매칭 대기 상태 스타일
  matchingWaitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffe3ed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#ffb6c1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  matchingIcon: {
    width: 60,
    height: 60,
    tintColor: "#ff6b6b",
  },
  matchingTitleText: {
    fontSize: 20,
    fontFamily: "Ongeulip",
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
  matchingSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Ongeulip",
  },
});
