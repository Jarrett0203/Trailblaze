import { StyleSheet, Text, TextInput, Pressable, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useClerk, useSignUp } from "@clerk/expo";

const SignUpScreen = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {signUp} = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const clerk = useClerk()

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password
    });
    if (error) {
      const errJSON = JSON.stringify(error, null, 2)
      console.error(errJSON);
      setError(error.message || "Sign up failed")
      return;
    }
    setError('');
    await signUp.verifications.sendEmailCode();
    setPendingVerification(true);
  }

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code: emailCode,
    });
    if (signUp.status === 'complete') {
      await clerk.setActive({session: signUp.createdSessionId});
      setError('');
    } else {
      console.error('Sign-up attempt not complete:', signUp);
      setError("Sign up not complete");
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text>Verify your email</Text>
        <TextInput style={styles.input} value={emailCode} onChangeText={setEmailCode} placeholder="Enter your verification code"/>
        {error !== '' && <Text style={styles.error}> {error} </Text>}
        <Pressable style={styles.button} onPress={onVerifyPress}>
          <Text> Verify </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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
      {error !== '' && <Text style={styles.error}> {error} </Text>}

      <Pressable style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account?</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.linkText, { color: "#FF5722"}]}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    borderColor: '#ccc',
    borderRadius: 5
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#FF5722", 
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  linkText: {
    fontSize: 16
  },
  error: {
    color: "red",
    marginBottom: 10
  }
});
