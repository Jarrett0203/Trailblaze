import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FormattedTrip, Trip, tripBackground } from "../types/Trip";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import dayjs from "dayjs";
import { ProfileStackParamsList } from "../navigation/ProfileStack";

export const placeholderProfileImageUrl =
  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

const ProfileScreen = () => {
  const { signOut } = useClerk();
  const { user: expoUser } = useUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamsList>>();
  const [formattedTrips, setFormattedTrips] = useState<FormattedTrip[]>();
  const [error, setError] = useState("");
  const [rawTrips, setRawTrips] = useState<Trip[]>([]);
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        try {
          const clerkUserId = expoUser?.id;
          if (!clerkUserId) {
            setError("User not authenticated");
            return;
          }

          const response = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips`,
            {
              params: { clerkUserId },
            },
          );

          const formattedTripsRes = response.data.trips.map((trip: Trip) => ({
            id: trip._id,
            name: trip.tripName,
            date: `${dayjs(trip.startDate).format("D MMM")} - ${dayjs(trip.endDate).format("D MMM")}`,
            image: trip.background || tripBackground,
            places: trip.placesToVisit?.length || 0,
            daysLeft: dayjs(trip.startDate).isAfter(dayjs())
              ? dayjs(trip.startDate).diff(dayjs(), "day")
              : 0,
          }));
          setFormattedTrips(formattedTripsRes);
          setRawTrips(response.data.trips);
          setError("");
        } catch (error) {
          console.error("Error fetching trips", error);
          if (axios.isAxiosError(error)) {
            console.error(error.stack);
            setError(error.response?.data.error || "Failed to fetch trips");
          }
        }
      };

      fetchTrips();
    }, [expoUser]),
  );

  const profileImage =
    expoUser?.imageUrl &&
    expoUser.externalAccounts.some((acc) => acc.provider === "google")
      ? expoUser?.imageUrl
      : placeholderProfileImageUrl;

  const email =
    expoUser?.primaryEmailAddress?.emailAddress || "No email address";
  const name = expoUser?.fullName || "User";
  const handle = `@${expoUser?.username || expoUser?.id.slice(0, 8)}`;

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="bg-pink-100 items-center pb-6 rounded-b-3xl relative">
          <View className="absolute top-4 left-4 bg-yellow-400 px-3 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">PRO</Text>
          </View>
          <View>
            <Image
              className="mt-3 w-24 h-24 rounded-full"
              source={{ uri: profileImage }}
            />
          </View>
          <Text className="mt-3 text-lg font-semibold">{name}</Text>
          <Text className="text-gray-500">{handle}</Text>
          <Text className="text-gray-500 text-sm mt-1">{email}</Text>
          <View className="flex-row justify-center mt-4 gap-x-12">
            <View className="items-center">
              <Text className="font-bold text-base">0</Text>
              <Text className="text-xs text-gray-500 tracking-wide">
                FOLLOWERS
              </Text>
            </View>
            <View className="items-center">
              <Text className="font-bold text-base">0</Text>
              <Text className="text-xs text-gray-500 tracking-wide">
                FOLLOWING
              </Text>
            </View>
          </View>
          <Pressable
            className="bg-orange-500 px-6 py-3 rounded-lg mt-4"
            onPress={handleSignOut}
          >
            <Text className="text-white text-base">Sign Out</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <Text className="text-sm text-orange-500 font-semibold mr-6">
            Trips
          </Text>
          <Text className="text-sm text-gray-400 mr-auto">Guides</Text>
          <Pressable className="flex-row items-center space-x-1">
            <Ionicons name="swap-vertical-outline" size={16} color={"#666"} />
            <Text className="text-sm text-gray-500">Sort</Text>
          </Pressable>
        </View>

        {formattedTrips?.length === 0 && !error && (
          <View className="px-4 mt-4">
            <Text className="text-gray-500 text-sm">
              No trips found. Create a new trip!
            </Text>
          </View>
        )}

        {formattedTrips?.map((trip, index) => (
          <Pressable
            key={trip.id}
            onPress={() =>
              navigation.navigate("PlanTrip", { trip: rawTrips[index] })
            }
            className="flex-row items-start bg-white rounded-xl shadow-sm mx-4 mt-4 p-3"
          >
            <Image
              className="w-16 h-16 rounded-lg mr-3"
              source={{ uri: trip.image }}
            />
            <View className="flex-1">
              {trip.daysLeft > 0 && (
                <Text className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full w-fit">
                  In {trip.daysLeft} days
                </Text>
              )}
              <Text className="text-sm font-semibold text-gray-900">
                {trip?.name}
              </Text>
              <View className="flex-row items-center">
                <Image
                  className="w-4 h-4 rounded-full mr-2"
                  source={{ uri: profileImage }}
                />
                <Text className="text-sm text-gray-500">
                  {trip.date} • {trip.places} places{" "}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
