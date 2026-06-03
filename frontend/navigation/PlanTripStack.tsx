import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Trip } from "../types/Trip";
import { ProfileStackParamsList } from "./ProfileStack";
import { HomeStackParamsList } from "./HomeStack";
import PlanTripScreen from "../screens/PlanTripScreen";
import AIChatScreen from "../screens/AIChatScreen";
import MapScreen from "../screens/MapScreen";
import { PlaceToVisit } from "../types/PlaceToVisit";

export type PlanTripStackParamsList = {
  PlanTripMain: { trip: Trip };
  AIChat: { tripName: string };
  MapScreen: {places: PlaceToVisit[]};
};

const Stack = createNativeStackNavigator<PlanTripStackParamsList>();

export const PlanTripStack = ({ route }: { route: RouteProp<HomeStackParamsList|ProfileStackParamsList, "PlanTrip"> }) => {
  const trip = route.params.trip;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanTripMain" component={PlanTripScreen} initialParams={{ trip }} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
};