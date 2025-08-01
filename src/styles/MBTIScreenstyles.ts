import { StyleSheet } from "react-native";

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  horizontalGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    justifyContent: "center",
  },
  verticalPair: {
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
    marginHorizontal: 6,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#FF9898",
    borderColor: "#FF9898",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  shadowWrapper: {
    alignItems: "center",
    marginTop: 40,
    height: BUTTON_HEIGHT + 8,
  },
  shadowLayer: {
    position: "absolute",
    top: 2,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT + 1.5,
    backgroundColor: "#B54D4D",
    borderRadius: 999,
    zIndex: 0,
  },
  submitButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: "#FF9898",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#B54D4D",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
