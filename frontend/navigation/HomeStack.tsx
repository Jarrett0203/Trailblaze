import { StyleSheet } from "react-native";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewTripScreen from "../screens/NewTripScreen";
import { SharedScreenParams } from "../types/Navigation";
import { PlanTripStack } from "./PlanTripStack";

export type HomeStackParamsList = {
  HomeMain: undefined;
  NewTrip: undefined;
} & SharedScreenParams;

export type TabNavigatorParamsList = {
  Home: undefined;
  Guides: undefined;
  Profile: undefined;
};

const HomeStack = () => {
  const Stack = createNativeStackNavigator<HomeStackParamsList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="NewTrip" component={NewTripScreen} />
      <Stack.Screen name="PlanTrip" component={PlanTripStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
