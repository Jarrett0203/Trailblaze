import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useClerk } from '@clerk/expo'

const ProfileScreen = () => {
  const {signOut} = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error", err);
    }
  }
  return (
    <SafeAreaView>
      <Text>ProfileScreen</Text>
      <Pressable onPress={handleSignOut}>
        <Text>Logout</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})