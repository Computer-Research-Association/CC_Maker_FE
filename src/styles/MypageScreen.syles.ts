import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  
  // 설정 버튼
  settingButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  settingIcon: {
    // No additional styling needed for the icon itself
  },

  // 프로필 섹션
  profileSection: {
    paddingTop: 100,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  profileBlock: {
    alignItems: "center",
    flex: 0,
    width: 100,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginBottom: 8,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  heartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  heartIcon: {
    width: 24,
    height: 24,
  },

  // 매칭된 사람 프로필 (더 크게)
  matchedProfileBlock: {
    alignItems: "center",
    flex: 0,
    width: 100,
  },
  matchedAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginBottom: 8,
  },
  matchedProfileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // 여러 명 매칭된 멤버들 컨테이너 0812
  matchedMembersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
    alignSelf: "center",
  },
  matchedMemberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // 미션 히스토리 섹션
  missionHistorySection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },

  // 타임라인
  timelineContainer: {
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#ff6b6b",
    opacity: 0.3,
  },
  missionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    position: "relative",
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    zIndex: 2,
  },
  completedIcon: {
    backgroundColor: "#ff6b6b",
  },
  pendingIcon: {
    backgroundColor: "#e5e7eb",
  },
  missionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: "#fdf2f7",
    borderLeftWidth: 3,
    borderLeftColor: "#ff6b6b",
  },
  pendingCard: {
    backgroundColor: "#f9fafb",
    borderLeftWidth: 3,
    borderLeftColor: "#d1d5db",
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  missionDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  missionDescription: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },

  // 기존 스타일들 (필요시 사용)
  myProfileBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  myAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    marginBottom: 10,
  },
  myName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  otherProfilesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  otherProfileBlock: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  otherAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
    marginBottom: 8,
  },
  otherName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  noMatchText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedTab: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  statusRow: {
    alignItems: "center",
    marginBottom: 30,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  emptyNoteContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  writeButtonMainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
