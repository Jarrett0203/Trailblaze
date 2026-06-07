import { StyleSheet, Text, TextInput, Pressable, View, Button, Linking, Platform } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/RootNavigator";
import OauthSignIn from "../components/OauthSignIn";
import { useAuth, useClerk, useSignIn } from "@clerk/expo";
import { GoogleSignInButton } from "../components/GoogleSignIn";

const SignInScreen = () => {
  const { setActive } = useClerk();
  const { isLoaded } = useAuth();
  const { signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const onSignInPress = async () => {
    if (!isLoaded) return;
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      const errJSON = JSON.stringify(error, null, 2);
      console.error(errJSON);
      setError(error.message || "Sign in failed");
      return;
    }
    if (signIn.status === "complete") {
      setError("");
      await setActive({ session: signIn.createdSessionId });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
      setError("Sign in not complete");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        autoCapitalize="none"
        placeholder="Enter Email"
        onChangeText={setEmailAddress}
        value={emailAddress}
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        placeholder="Enter Password"
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      {error !== "" && <Text style={styles.error}> {error} </Text>}

      <Pressable onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account?&nbsp;</Text>
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.linkText, { color: "#FF5722" }]}> Sign Up</Text>
        </Pressable>
      </View>

      {/* <OauthSignIn /> */}
      {Platform.OS === 'web' ? <OauthSignIn /> : <GoogleSignInButton />}
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
