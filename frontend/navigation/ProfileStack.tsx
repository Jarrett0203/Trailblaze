// navigation/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import PlanTripScreen from '../screens/PlanTripScreen';
import { Trip } from '../types/Trip';

export type ProfileStackParamsList = {
  ProfileMain: undefined;
  PlanTrip: { trip: Trip };
};

const Stack = createNativeStackNavigator<ProfileStackParamsList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="PlanTrip" component={PlanTripScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;