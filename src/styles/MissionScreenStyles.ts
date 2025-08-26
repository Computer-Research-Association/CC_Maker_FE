import { StyleSheet, Dimensions } from "react-native";
import { FontFamily } from './GlobalStyles';

const windowWidth = Dimensions.get("window").width;
const BOX_SIZE = 108;
const BOX_MARGIN = 4;
const BOX_PER_ROW = 3;
const GRID_WIDTH = BOX_PER_ROW * (BOX_SIZE + BOX_MARGIN * 2);

const styles = StyleSheet.create({
  // MissionScreen 메인 스타일
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 12,
    paddingBottom: 50,
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  gridContainer: {
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  // MissionGrid 스타일
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: GRID_WIDTH + 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    backgroundColor: "#FF9494",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    fontFamily: FontFamily.medium,
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
  completedBox: {
    backgroundColor: "#d3d3d3",
  },
  missionBoxText: {
    padding: 10,
    textAlign: "center",
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: "#333",
  },

  // 모달 관련 스타일
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
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  modalButtonText: {
    fontSize: 17,
    color: "#333",
    fontFamily: FontFamily.medium,
  },
  confirmButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    marginBottom: 7,
  },
  confirmButtonText: {
    color: "#fff",
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

  // MissionDetailModal 추가 스타일
  missionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  missionBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#FF8CC6",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 12,
    width: "90%",
    minHeight: 280,
    minWidth: 200,
    overflow: "visible",
    position: "relative",
    alignSelf: "flex-end",
    marginRight: 20,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  missionContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  missionContent: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontFamily: FontFamily.medium,
    lineHeight: 22,
  },
  refreshButton: {
    position: "absolute",
    bottom: 10,
    right: 12,
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    minHeight: 28,
    borderRadius: 10,
    zIndex: 1,
  },
  refreshText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },

  // CongratsModal 추가 스타일
  congratsTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    marginBottom: 10,
    color: '#ff6b6b',
  },
  congratsMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: FontFamily.medium,
  },

  // WaitingState 스타일
  waitingContainer: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchingWaitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  waitingIconContainer: {
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
  waitingIcon: {
    width: 60,
    height: 60,
    tintColor: "#ff6b6b",
  },
  waitingTitleText: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
  waitingSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: FontFamily.regular,
  },
});

export default styles;
