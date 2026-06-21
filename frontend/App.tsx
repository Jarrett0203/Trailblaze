import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import RootNavigator from "./navigation/RootNavigator";
import { ClerkProvider } from '@clerk/expo'
import * as SecureStore from "expo-secure-store";
import { maybeCompleteAuthSession } from "expo-web-browser";

maybeCompleteAuthSession();

const tokenCache = {
  async getToken(key: string) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('saveToken error:', err);
    }
  },
};

export default function App() {

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }


  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <NavigationContainer documentTitle={{
        enabled: true,
        formatter: (options, route) => options?.title ?? route?.name ?? "Home"
      }}>
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
