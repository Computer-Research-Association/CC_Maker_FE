import { StyleSheet } from "react-native";
import { FontFamily } from '../GlobalStyles';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 28,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 16,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  codeText: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginRight: 10,
  },
  iconButton: {
    padding: 4,
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  closeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
});
