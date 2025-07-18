import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },

  // styles.ts 수정 예시
profileContainer: {
  flexDirection: "row",
  paddingTop: 20,
  paddingLeft : 50,
  paddingHorizontal: 20,
  justifyContent: "space-between",  // 좌우 끝 정렬
  alignItems: "flex-start",
},


  // ✅ 본인 프로필
  myProfileBlock: {
  alignItems: "center",

},

  myAvatar: {
    width: 120,
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
  },

  myName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // ✅ 나머지 프로필 컨테이너 (세로 evenly)
otherProfilesContainer: {
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "flex-end",   // 오른쪽 정렬
  paddingRight : 40,
  flex: 1,
},

  otherProfileBlock: {
    alignItems: "center",
  },

  otherAvatar: {
    width: 80,
    height: 80,
    backgroundColor: "#ddd",
    borderRadius: 12,
    marginBottom: 8,
  },

  otherName: {
    fontSize: 14,
  },

  // ✅ 기존 탭, 버튼 영역 유지
  tabRow: {
    flexDirection: "row",
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 20,
  },

  tabText: {
    marginRight: 16,
    paddingBottom: 6,
    fontSize: 14,
    color: "#888",
  },

  selectedTab: {
    borderBottomWidth: 2,
    borderColor: "#000",
    color: "#000",
    fontWeight: "bold",
  },

  statusRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  statusText: {
    fontSize: 12,
    color: "#555",
  },

  emptyNoteContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  writeButtonMain: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  writeButtonMainText: {
    color: "#fff",
    fontWeight: "bold",
  },

  settingIcon: {
    position: "absolute",
    top: -40,
    right: 10,
    zIndex: 999,
    padding: 13,
  },
  noMatchText: {
  fontSize: 14,
  color: "#999",
  textAlign: "center",
  marginTop: 20,
},

});

export default styles;
