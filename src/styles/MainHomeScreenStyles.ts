import { StyleSheet, Dimensions } from "react-native";
import { FontFamily } from './GlobalStyles';

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 나가기 버튼 관련 스타일
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },

  teamCard: {
    width: windowWidth - 60, // 좌우 패딩 30씩으로 늘림
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  teamName: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },
  addCard: {
    width: windowWidth - 60, // 좌우 패딩 30씩으로 늘림
    height: 120,
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
    fontFamily: FontFamily.semiBold,
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
    fontFamily: FontFamily.bold,
  },
  // create 버튼
  createButton: {
    backgroundColor: "#ffd1d1",
    borderRadius: 12, // 둥글게
    marginBottom: 7, // 버튼 간격
    fontFamily: FontFamily.bold,
  },
  // join 버튼
  joinButton: {
    backgroundColor: "#ffe3e1",
    borderRadius: 12,
    marginBottom: 10,
    fontFamily: FontFamily.bold,
  },
  cancelButton: {
    borderBottomWidth: 0,
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    textAlign: "center",
    fontFamily: FontFamily.medium,
  },
});

export default styles;
