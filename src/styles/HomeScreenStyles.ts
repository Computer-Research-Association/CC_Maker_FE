import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 30, width: "100%" },
  subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  teamNameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  groupTitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  crown: {
    fontSize: 48,
    color: "#FFD700",
    marginBottom: 4,
  },
  progressCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  myCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  topTeamCard: {
    backgroundColor: "#FFE3E1",
    borderColor: "#FF9494",
    borderWidth: 1.5,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 16, // 위아래 간격 조절
  },
  matchingMessage: {
    fontSize: 24, // ✅ 큰 텍스트
    fontWeight: "600", // ✅ 반굵게
    color: "#999", // ✅ 연한 회색
    textAlign: "center", // ✅ 중앙 정렬
    marginTop: "0%", // ✅ 세로 중앙 근처 배치 (안정적)
    transform: [{ translateY: -20 }], // ✅ 텍스트 높이 보정 (정중앙에 더 가깝게)
  },
});

export default styles;
