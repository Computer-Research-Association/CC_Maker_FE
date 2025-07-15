import React, { useContext, useState } from "react";
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

const BOX_SIZE = 120;
const BOX_MARGIN = 6;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

export default function MissionScreen() {
  const { teamId } = useContext(TeamContext);

  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBoxPress = (index: number) => {
    setSelectedBoxIndex(index);
    setModalVisible(true);
  };

  const handleComplete = () => {
    console.log(`미션 ${selectedBoxIndex} 완료`);
    setModalVisible(false);
    // 여기서 서버로 완료 처리 요청 등을 추가할 수 있음
  };

  const handleRefresh = (index: number) => {
    console.log(`미션 ${index} 새로고침`);
    // API 호출 등 실제 로직 작성
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>1학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TouchableOpacity
              key={`1-credit-${i}`}
              style={styles.box}
              onPress={() => handleBoxPress(i)}
            >
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleRefresh(i)}
              >
                <Text style={styles.refreshText}>↻</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>3학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TouchableOpacity
              key={`3-credit-${i}`}
              style={styles.box}
              onPress={() => handleBoxPress(i)}
            >
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleRefresh(i)}
              >
                <Text style={styles.refreshText}>↻</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 5학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>5학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TouchableOpacity
              key={`5-credit-${i}`}
              style={styles.box}
              onPress={() => handleBoxPress(i)}
            >
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleRefresh(i)}
              >
                <Text style={styles.refreshText}>↻</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 10학점 */}
      <View style={styles.section}>
        <Text style={styles.title}>10학점</Text>
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TouchableOpacity
              key={`10-credit-${i}`}
              style={styles.box}
              onPress={() => handleBoxPress(i)}
            >
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleRefresh(i)}
              >
                <Text style={styles.refreshText}>↻</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
