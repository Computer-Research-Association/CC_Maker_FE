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
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 12,
  },
  modalCode: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  modalCodeEmail: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: "#333",
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  closeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
});
