import { StyleSheet } from "react-native";
import { FontFamily } from './GlobalStyles';

const styles = StyleSheet.create({
  // CheckScreen 메인 스타일
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },

  // MemberList 스타일
  memberListContainer: {
    flex: 1,
  },
  role: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 6,
    color: "#333",
  },
  count: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    textAlign: "center",
    marginBottom: 25,
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  name: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: "#333",
  },
  checkbox: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 6,
  },

  // MatchingButton 스타일
  infoContainer: {
    alignItems: "center",
    marginBottom: 32,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  infoTitle: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: FontFamily.medium,
    color: "#666",
    textAlign: "center",
  },
  infoSubtitle: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: "#999",
    textAlign: "center",
  },

  // 모달 관련 스타일
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    color: "#333",
    textAlign: "center",
    marginBottom: 14,
  },
  modalButton: {
    backgroundColor: "#FF9898",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#E08B8B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: FontFamily.bold,
    textAlign: "center",
  },
});

export default styles;
