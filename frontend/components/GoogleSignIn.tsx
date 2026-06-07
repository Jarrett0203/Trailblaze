import { useClerk } from "@clerk/expo";
import { useSignInWithGoogle } from "@clerk/expo/google";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export function GoogleSignInButton() {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const clerk = useClerk();

  // Only render on iOS and Android
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
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
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
});
