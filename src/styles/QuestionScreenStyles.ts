import { StyleSheet } from "react-native";
import { FontFamily } from './GlobalStyles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 280,
    paddingBottom: 24,
  },
  contentArea: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginBottom: 24,
  },
  questionText: {
    fontSize: 22,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 2, // 좌우 여백
    marginBottom: 250,
  },
});

export default styles;
