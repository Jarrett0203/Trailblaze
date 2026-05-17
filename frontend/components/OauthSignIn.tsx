import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { coolDownAsync, maybeCompleteAuthSession, warmUpAsync } from 'expo-web-browser'
import { useSSO } from '@clerk/expo'
import { OAuthStrategy } from '@clerk/shared/types'
import { createURL } from 'expo-linking'

const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void warmUpAsync();
    return () => {
      void coolDownAsync();
    }
  }, [])
}

maybeCompleteAuthSession();

const OauthSignIn = () => {
  const [error, setError] = useState("");
  const { startSSOFlow } = useSSO();
  const [submittingStrategy, setSubmittingStrategy] = useState<OAuthStrategy | null>(null)

  useWarmUpBrowser();

  const onOauthSignInPress = useCallback(async(strategy: OAuthStrategy, name: string) => {
    setError("");
    setSubmittingStrategy(strategy);

    try {
      const {createdSessionId, setActive} = await startSSOFlow({
        strategy,
        redirectUrl: createURL("/")
      })
      if (createdSessionId)  {
        await setActive!({session: createdSessionId});
      } else {
        setError("")
      }
    } catch (error) {
      setError(`${name} sign-in incomplete, please try again.`)
    } finally {
      setSubmittingStrategy(null);
    }
  }, [])

  const providers = [
    { strategy: 'oauth_google', name: 'Google' }
  ]

  return (
    <View className='w-full'>
      {error && <Text className='text-red-500 text-sm text-center mb-3'>{error}</Text>}
      {
        providers.map((provider) => {
          const strategy = provider.strategy as OAuthStrategy
          const isThisProviderLoading = submittingStrategy === strategy;
          return (<Pressable key={provider.strategy}  onPress={() => onOauthSignInPress(strategy, provider.name)} className='w-full border border-gray-300 py-3 mt-3 rounded-lg flex-row justify-center items-center'>
            {
              isThisProviderLoading ? (
                <ActivityIndicator color="#FF5722" />
              ) : (
                <>
                  <Image
                    source={{ uri: "https://www.google.com/favicon.ico" }}
                    className='w-5 h-5 mr-2' 
                  />
                  <Text className="text-gray-900 text-base font-semibold">
                    Sign In with {provider.name}
                  </Text>
                </>
              )
            }
          </Pressable>)
        })
      }
    </View>
  )
}

export default OauthSignIn

const styles = StyleSheet.create({})