import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GuideScreen from '../screens/GuideScreen'
import { Guide } from '../types/Guide'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GuideDetailScreen from '../screens/GuideDetailScreen'

export type GuideStackParamList = {
  GuideMain: undefined
  GuideDetail: { guide: Guide }
}

const GuideStack = () => {
  const Stack = createNativeStackNavigator<GuideStackParamList>();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='GuideMain' component={GuideScreen} />
      <Stack.Screen name='GuideDetail' component={GuideDetailScreen} />
    </Stack.Navigator>
  )
}

export default GuideStack

const styles = StyleSheet.create({})