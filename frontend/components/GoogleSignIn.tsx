import { useClerk } from '@clerk/expo';
import { useSignInWithGoogle } from '@clerk/expo/google'
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const testRawGoogleSignIn = async () => {
  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID,
    });
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();
    console.log('ID token obtained:', !!result.data?.idToken);
    console.log('Email:', result.data?.user?.email);
    console.log('ID token prefix:', result.data?.idToken?.substring(0, 20));
  } catch (e: any) {
    console.error('Google error code:', e.code);
    console.error('Google error message:', e.message);
  }
};

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void
}

export function GoogleSignInButton({
  onSignInComplete,
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle()
  const clerk = useClerk();

  // Only render on iOS and Android
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return null
  }

const handleGoogleSignIn = async () => {
  try {
    const { createdSessionId, setActive, signIn, signUp } = await startGoogleAuthenticationFlow({});

console.log('createdSessionId:', createdSessionId);
console.log('signIn status:', signIn?.status);
console.log('signUp status:', signUp?.status);
console.log('signUp missing fields:', signUp?.missingFields);

if (!createdSessionId) {
  console.error("createdSessionId is null");
}

if (createdSessionId && setActive) {
  await setActive({ session: createdSessionId });
} else if (signUp?.status === 'missing_requirements') {
  // New user - complete sign up
  const result = await signUp.create({});
  if (result.status === 'complete') {
    await setActive!({ session: result.createdSessionId });
  }
} else if (signIn?.status === 'needs_first_factor') {
  // Existing user needs additional verification
  console.log('needs first factor');
}
  } catch (err: any) {
    console.error('error message:', err?.message);
    console.error('error code:', err?.code);
  }
};

  return (
    <>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
})