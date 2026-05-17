import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import React from "react";
import RootNavigator from "./navigation/RootNavigator";
import { tokenCache } from '@clerk/expo/token-cache'
import { ClerkProvider } from '@clerk/expo'
import * as SecureStore from "expo-secure-store";

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key:string, value:string) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    }
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
