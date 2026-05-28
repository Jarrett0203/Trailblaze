import { Alert, AlertButton, Platform } from "react-native";

export function crossPlatformAlert(
  title: string,
  message: string,
  buttons: AlertButton[] = [],
  onConfirm: () => void = () => {} 
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}