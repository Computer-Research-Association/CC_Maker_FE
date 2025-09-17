import { StyleSheet } from "react-native";
import { FontFamily } from './GlobalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 70,
  },
  role: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  count: {
    textAlign: "right",
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    marginRight: 12,
    fontFamily: "Ongeulip",
  },
  listContainer: {
    borderRadius: 10,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Ongeulip",
  },
  checkbox: {
    fontSize: 26,
    color: "purple",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff9494",
    paddingHorizontal: 100,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontFamily: FontFamily.bold,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },
  modalButton: {
    backgroundColor: "#8de969",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: FontFamily.bold,
    fontSize: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 12,
    marginVertical: 4,
  },
});

export default styles;
