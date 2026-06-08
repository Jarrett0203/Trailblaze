import { useSignInWithGoogle } from "@clerk/expo/google";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
} from "react-native";

export function GoogleSignInButton() {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const [isLoading, setIsLoading] = useState(false);

  // Only render on iOS and Android
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive, signIn, signUp } =
        await startGoogleAuthenticationFlow({});

      if (!createdSessionId) {
        console.error("createdSessionId is null");
      }

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else if (signUp?.status === "missing_requirements") {
        // New user - complete sign up
        const result = await signUp.create({});
        if (result.status === "complete") {
          await setActive!({ session: result.createdSessionId });
        }
      } else if (signIn?.status === "needs_first_factor") {
        // Existing user needs additional verification
        console.log("needs first factor");
      }
    } catch (err: any) {
      console.error("error message:", err?.message);
      console.error("error code:", err?.code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleGoogleSignIn}
      className="w-full border border-gray-300 py-3 mt-3 rounded-lg flex-row justify-center items-center"
    >
      {isLoading ? (
        <ActivityIndicator color="#FF5722" />
      ) : (
        <>
          <Image
            source={{ uri: "https://www.google.com/favicon.ico" }}
            className="w-5 h-5 mr-2"
          />
          <Text className="text-gray-900 text-base font-semibold">
            Sign In with Google
          </Text>
        </>
      )}
    </Pressable>
  );
}
