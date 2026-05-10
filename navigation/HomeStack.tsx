import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'


export type HomeStackParamsList = {
  HomeMain: undefined;
  NewTrip: undefined;
  PlanTrip: {trip: any};
  AIChat: undefined;
  MapScreen: undefined;
}

export type TabNavigatorParamsList = {
  Home: typeof HomeScreen
  Guides: typeof GuideScreen
  Profile: typeof ProfileScreen
}

const HomeStack = () => {
  const Stack = createNativeStackNavigator<HomeStackParamsList>();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='HomeMain' component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})