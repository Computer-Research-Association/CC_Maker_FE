import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 0,
  },
  groupTitleContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  crown: {
    fontSize: 44,
    marginBottom: 2,
    fontWeight: "bold",
    color: "#ff6b6b",
    textShadowColor: "rgba(255, 107, 107, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  myNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  testNameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  myCardBox: {
    width: 320,
    backgroundColor: "#ffe3ed",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ffb6c1",
    padding: 18,
    marginBottom: 18,
    shadowColor: "#ffb6c1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  otherCardBox: {
    width: 320,
    backgroundColor: "#fff", // 흰색으로 변경
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0", // 더 연한 회색 테두리
    padding: 18,
    marginBottom: 14,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  blueCardBox: {
    backgroundColor: "#e3f0ff",
    borderColor: "#d1e8ff", // 더 연한 파랑색 테두리
    shadowColor: "#7ecbff",
  },
  otherNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  blueNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196f3",
  },
  topCardBox: {
    width: 320,
    backgroundColor: "#FDF2F7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffdeec", // 더 연한 빨간색 테두리
    padding: 18,
    marginBottom: 18,
    shadowColor: "#ff5a5a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  topNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5a5a",
  },
  divider: {
    width: 320,
    height: 1.5,
    backgroundColor: "#e0e0e0", // 회색으로 변경
    marginVertical: 16,
    alignSelf: "center",
  },
  // Add missing styles
  teamNameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    maxWidth: 280,
  },
  progressCard: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topTeamCard: {
    backgroundColor: "#FDF2F7",
    borderColor: "#ffdeec",
    shadowColor: "#ff5a5a",
    shadowOpacity: 0.2,
  },
  myCard: {
    backgroundColor: "#ffe3ed",
    borderColor: "#ffb6c1",
    shadowColor: "#ffb6c1",
    shadowOpacity: 0.15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
  },
});

export default styles;
