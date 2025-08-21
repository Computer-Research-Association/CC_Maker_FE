import { StyleSheet } from "react-native";
import { FontFamily } from './GlobalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 50,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: "center",
    fontFamily: FontFamily.bold,
  },
  label: {
    marginBottom: 6,
    fontFamily: FontFamily.semiBold,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    marginBottom: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
  radioGroup: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  roundButton: {
    backgroundColor: "#FF9898",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  roundButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1000,
  },
  emailInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10, // 좌우 패딩만 줌, 위아래 패딩은 0으로
    paddingVertical: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  dropdownWrapper: {
    flex: 5,
    height: 50,
    zIndex: 1000,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10, // emailInput과 맞춤
    paddingVertical: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1000,
  },
  // 개인정보 활용 동의서 관련 스타일
  privacySection: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  privacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: "#333",
    flex: 1,
  },
  privacyContent: {
    fontSize: 12,
    lineHeight: 18,
    color: "#666",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF9898",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF9898",
  },
  checkboxText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  checkboxError: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  expandButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  expandButtonText: {
    color: "#FF9898",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});

export default styles;
