// import React, { useContext, useState, useEffect } from "react";
// import {
//   Alert,
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Button,
//   TextInput,
// } from "react-native";
// import { TeamContext } from "../screens/TeamContext";
// import MissionBox from "../component/MissionBox";
// import api from "../api/apiClient";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import SubmitButton from "../component/SubmitButton";

// const BOX_SIZE = 108;
// const BOX_MARGIN = 4;
// const BOX_PER_ROW = 3;
// const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

// export default function MissionScreen() {
//   const { role, teamId, subGroupIdMap, teamName } = useContext(TeamContext);
//   const [missions, setMissions] = useState<any[]>([]);
//   const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [minScore, setMinScore] = useState<string>("");
//   const [confirmModalVisible, setConfirmModalVisible] = useState(false);

//   // teamId가 있을 때 subGroupId 뽑기
//   const subGroupId = teamId ? subGroupIdMap[teamId] : undefined;

//   useEffect(() => {
//     console.log("✅ teamId:", teamId);
//     console.log("✅ subGroupIdMap:", subGroupIdMap);
//     console.log("✅ subGroupId:", subGroupId);

//     if (!teamId || !subGroupId) return;

//     const fetchMissions = async () => {
//       try {
//         // 1. 미션 목록 가져오기
//         const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
//         console.log("✅ 미션 API 응답:", res.data);

//         // 2. 미션이 없으면 미션 부여 API 호출
//         if (res.data.length === 0) {
//           console.log("⚠️ 미션 없음 → 미션 부여 API 호출");
//           try {
//             await api.post(`/api/missions/assign/subgroup/${subGroupId}`);
//             console.log("✅ 미션 부여 완료 → 다시 목록 요청");

//             // 3. 다시 미션 목록 불러오기
//             const newRes = await api.get(
//               `/api/missions/subgroup/${subGroupId}`
//             );
//             setMissions(newRes.data);
//           } catch (assignError) {
//             console.error("❌ 미션 부여 실패:", assignError);
//             alert("미션 부여 중 오류가 발생했습니다.");
//           }
//         } else {
//           // 미션이 있으면 그대로 저장
//           setMissions(res.data);
//         }
//       } catch (err) {
//         console.error("❌ 미션 불러오기 실패:", err);
//       }
//     };

//     fetchMissions();
//   }, [teamId, subGroupId]);

//   console.log("✅ missions:", missions);

//   const handleBoxPress = (index: number) => {
//     setSelectedBoxIndex(index);
//     setModalVisible(true);
//   };

//   // 미션 완료 관리
//   const handleComplete = async () => {
//     if (selectedBoxIndex === null) return;
//     const mission = missions[selectedBoxIndex];

//     try {
//       await api.post("/api/missions/complete", {
//         teamId,
//         subGroupId,
//         missionId: mission.missionTemplateId,
//       });
//       alert(`${mission.title} 미션이 완료 처리되었습니다.`);

//       // 1) 미션 리스트 다시 불러오기 대신,
//       // 2) 상태를 직접 업데이트 (즉시 UI 반영)
//       setMissions((prev) =>
//         prev.map((m, i) =>
//           i === selectedBoxIndex ? { ...m, completed: true } : m
//         )
//       );
//     } catch (error) {
//       console.error("미션 완료 처리 실패:", error);
//       alert("미션 완료 처리에 실패했습니다.");
//     } finally {
//       setModalVisible(false);
//     }
//   };

//   // 미션 새로고침
//   const handleRefresh = async (index: number) => {
//     const mission = missions[index];

//     try {
//       await api.post(
//         `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
//       );
//       alert(`${mission.title} 미션이 새로고침되었습니다.`);

//       // 새로고침 후 미션 리스트 갱신
//       const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
//       setMissions(res.data);
//     } catch (error) {
//       console.error("미션 새로고침 실패:", error);
//       alert("미션 새로고침에 실패했습니다.");
//     }
//   };

//   const confirmRefresh = async () => {
//     if (selectedBoxIndex === null) return;
//     const mission = missions[selectedBoxIndex];

//     try {
//       await api.post(
//         `/api/missions/refresh/subgroup/${subGroupId}/${mission.subGroupMissionId}/${mission.score}`
//       );
//       alert(`${mission.title} 미션이 새로고침되었습니다.`);

//       const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
//       setMissions(res.data);
//     } catch (error) {
//       console.error("미션 새로고침 실패:", error);
//       alert("미션 새로고침에 실패했습니다.");
//     } finally {
//       setConfirmModalVisible(false);
//     }
//   };

//   // 학점별 미션 분류
//   const missionsByScore = (score: number) =>
//     missions.filter((m) => m.score === score);

//   return (
//     <SafeAreaView
//       style={{ flex: 1, backgroundColor: "#fff" }}
//       edges={["bottom"]}
//     >
//       <View style={styles.topheader}></View>

//       <ScrollView
//         contentContainerStyle={styles.container}
//         style={{ backgroundColor: "#fff" }}
//       >
//         <View style={styles.header}>
//           <Text style={styles.logoText}>
//             🌟 {teamName ?? "팀 이름이 없습니다"} 팀 CC 미션 🌟
//           </Text>
//         </View>
//         {/* 기존 미션 UI */}
//         {[1, 3, 5, 10].map((score) => (
//           <View key={score} style={styles.section}>
//             <Text style={styles.title}>{score}학점</Text>
//             <View style={styles.grid}>
//               {missionsByScore(score).map((mission, i) => (
//                 <TouchableOpacity
//                   key={`${score}-credit-${mission.subGroupMissionId}`}
//                   style={[styles.box, mission.completed && styles.completedBox]}
//                   onPress={() =>
//                     !mission.completed &&
//                     handleBoxPress(missions.indexOf(mission))
//                   }
//                   disabled={mission.completed}
//                 >
//                   <Text style={{ padding: 10, textAlign: "center" }}>
//                     {mission.description}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <Modal
//         transparent
//         animationType="fade"
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//           setConfirmModalVisible(false);
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {confirmModalVisible ? (
//               // ✅ 새로고침 확인 화면
//               <>
//                 <Text style={styles.missionTitle}>
//                   정말 이 미션을 새로고침할까요?
//                 </Text>
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={styles.confirmButton}
//                     onPress={confirmRefresh}
//                   >
//                     <Text style={styles.buttonText}>새로고침</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.cancelButton}
//                     onPress={() => setConfirmModalVisible(false)}
//                   >
//                     <Text style={styles.buttonText}>아니오</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               // ✅ 미션 상세 화면
//               <>
//                 <Text style={styles.missionTitle}>
//                   {missions[selectedBoxIndex!]?.score}학점
//                 </Text>

//                 <View style={styles.missionBox}>
//                   <View style={styles.missionContentWrapper}>
//                     <Text style={styles.missionContent}>
//                       {selectedBoxIndex !== null
//                         ? missions[selectedBoxIndex].description
//                         : ""}
//                     </Text>
//                   </View>

//                   <TouchableOpacity
//                     style={styles.refreshButton}
//                     onPress={() => setConfirmModalVisible(true)}
//                     disabled={
//                       selectedBoxIndex === null ||
//                       missions[selectedBoxIndex].completed
//                     }
//                   >
//                     <Text style={styles.refreshText}>↻ 새로고침</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalButtons}>
//                   <SubmitButton
//                     title="미션완료"
//                     // style={styles.confirmButton}
//                     onPress={handleComplete}
//                     width={100}
//                     height={100}
//                     buttonColor="#FF9898"
//                     shadowColor="#E08B8B"
//                   >
//                     <Text style={styles.buttonText}>미션 완료</Text>
//                   </SubmitButton>
//                   <SubmitButton
//                     // style={styles.cancelButton}
//                     title="취소"
//                     onPress={() => setModalVisible(false)}
//                     buttonColor="#bbb"
//                     width={100}
//                     height={100}
//                     shadowColor="#aaa"
//                   >
//                     <Text style={styles.buttonText}>취소</Text>
//                   </SubmitButton>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

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
import { LinearGradient } from "expo-linear-gradient";
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
  const [minScore, setMinScore] = useState<string>("");
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
        console.error("❌ 미션 불러오기 실패:", err);
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
      alert(`${mission.title} 미션이 완료 처리되었습니다.`);
      setMissions((prev) =>
        prev.map((m, i) =>
          i === selectedBoxIndex ? { ...m, completed: true } : m
        )
      );
    } catch (error) {
      alert("미션 완료 처리에 실패했습니다.");
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
      alert(`${mission.title} 미션이 새로고침되었습니다.`);
      const res = await api.get(`/api/missions/subgroup/${subGroupId}`);
      setMissions(res.data);
    } catch (error) {
      alert("미션 새로고침에 실패했습니다.");
    } finally {
      setConfirmModalVisible(false);
    }
  };

  const missionsByScore = (score: number) =>
    missions.filter((m) => m.score === score);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <View style={styles.topheader} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            🌟 {teamName ?? "팀 이름이 없습니다"} 팀 CC 미션 🌟
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
                  <Text style={{ padding: 10, textAlign: "center" }}>
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
                    <Text style={styles.buttonText}>아니오</Text>
                  </TouchableOpacity>
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
    alignItems: "flex-start", // 이미 잘 되어 있음
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
});
