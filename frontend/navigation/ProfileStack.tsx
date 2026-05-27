// navigation/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import { SharedScreenParams } from '../types/Navigation';
import { PlanTripStack } from './PlanTripStack';

export type ProfileStackParamsList = {
  ProfileMain: undefined;
} & SharedScreenParams;

const Stack = createNativeStackNavigator<ProfileStackParamsList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="PlanTrip" component={PlanTripStack} />
    </Stack.Navigator>
  );
};

export default ProfileStack;