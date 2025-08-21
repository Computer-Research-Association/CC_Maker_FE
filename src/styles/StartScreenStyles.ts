import { StyleSheet } from "react-native";
import { FontFamily } from './GlobalStyles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginBottom: 12,
    color: "#111",
    marginTop: 50,
  },
  input: {
    backgroundColor: "#f7f8fa",
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    marginTop: 100,
  },
  button: {
    backgroundColor: "#FF9898",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 350,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
});

export default styles;
