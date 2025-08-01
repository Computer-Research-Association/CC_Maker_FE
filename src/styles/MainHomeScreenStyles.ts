import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    color: "#111",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
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
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10, //  Android
  },
  modalButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8, // 아이콘과 텍스트 간격
  },
  modalButtonText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  // create 버튼
  createButton: {
    backgroundColor: "#ffd1d1",
    borderRadius: 12, // 둥글게
    marginBottom: 7, // 버튼 간격
    fontWeight: "bold",
  },
  // join 버튼
  joinButton: {
    backgroundColor: "#ffe3e1",
    borderRadius: 12,
    marginBottom: 10,
    fontWeight: "bold",
  },
  cancelButton: {
    borderBottomWidth: 0,
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default styles;
