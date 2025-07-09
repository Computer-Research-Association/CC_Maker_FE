import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    paddingTop: 100,
  },

  // ✅ 새로 추가: 중앙 정렬된 프로필 영역
  profileRow: {
    flexDirection: "row",
    justifyContent: "center", // 가운데 정렬
    alignItems: "center",
    marginTop: 20,
    gap: 80, // ← 두 블럭 사이 간격 (React Native 0.71+만 지원됨)
  },

  profileBlock: {
    alignItems: "center", // 아바타와 텍스트 수직 정렬
  },

  avatar: {
    width: 120,
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
  },

  // ✅ 새로 추가: 이름 + 아이디 중앙 정렬
  nameBox: {
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar_2: {
    width: 64,
    height: 64,
    backgroundColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
  },

  // ✅ 새로 추가: 이름 + 아이디 중앙 정렬
  nameBox_2: {
    alignItems: "center",
  },

  name_2: {
    fontSize: 18,
    fontWeight: "bold",
  },

  friendButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  friendText: {
    fontSize: 12,
  },

  // ❌ 제거된 스타일
  // profileRow: { ... },
  // avatarWrapper: { ... },
  // editButton: { ... },a
  // iconRow: { ... },
  // iconBox: { ... },

  tabRow: {
    flexDirection: "row",
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: "#ccc",
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
  },

  statusText: {
    fontSize: 12,
    color: "#555",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  emptyNoteContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyNoteText: {
    color: "#999",
    marginBottom: 16,
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

  writeButton: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  writeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 8,
    marginTop: 12,
  },

  settingIcon: {
    position: "absolute",
    top: -40,
    right: 10,
    zIndex: 999,
    padding: 13,
    // elevation: 10,
  },
});

export default styles;
