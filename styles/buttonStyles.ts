import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#111",
    borderRadius: 10,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
});
