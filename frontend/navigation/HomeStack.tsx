import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NewTripScreen from '../screens/NewTripScreen';


export type HomeStackParamsList = {
  HomeMain: undefined;
  NewTrip: undefined;
  PlanTrip: {trip: any};
  AIChat: undefined;
  MapScreen: undefined;
}

export type TabNavigatorParamsList = {
  Home: undefined
  Guides: undefined
  Profile: undefined
}

const HomeStack = () => {
  const Stack = createNativeStackNavigator<HomeStackParamsList>();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='HomeMain' component={HomeScreen} />
      <Stack.Screen name="NewTrip" component={NewTripScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})