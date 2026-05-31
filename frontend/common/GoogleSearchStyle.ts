import { TextStyle, ViewStyle } from "react-native";

export const GoogleSearchStyle: {
  container: ViewStyle;
  input: TextStyle;
  suggestionsContainer: ViewStyle;
} = {
  container: {
    width: "100%",
    maxWidth: 1200,
    padding: 10,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    flex: 1,
    height: 44,
    color: "#333",
    fontSize: 16,
    marginLeft: 5,
    borderColor: "transparent",
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    maxHeight: "100%",
  },
};
