import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, DateData } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";
import { useUser } from "@clerk/expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Trip, tripBackground } from "../types/Trip";
import { HomeStackParamsList } from "../navigation/HomeStack";
import { GoogleSearchStyle } from "../common/GoogleSearchStyle";

type DateRange = {
  startDate?: string;
  endDate?: string;
};

const NewTripScreen = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({});
  const [displayStart, setDisplayStart] = useState("");
  const [displayEnd, setDisplayEnd] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [chosenLocation, setChosenLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user: expoUser } = useUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamsList>>();
  const today = dayjs().format("YYYY-MM-DD");
  // const [isFocused, setIsFocused] = useState(false);

  const getMarkedDates = () => {
    const marks: Record<string, MarkingProps> = {};

    const { startDate, endDate } = selectedRange;
    if (startDate && endDate) {
      let curr = dayjs(startDate);
      const end = dayjs(endDate);

      while (curr.isBefore(end) || curr.isSame(end)) {
        const formatted = curr.format("YYYY-MM-DD");
        marks[formatted] = {
          color: "#FF5722",
          textColor: "white",
          ...(formatted === startDate && { startingDay: true }),
          ...(formatted === endDate && { endingDay: true }),
        };
        curr = curr.add(1, "day");
      }
    } else if (startDate) {
      marks[startDate] = {
        startingDay: true,
        endingDay: true,
        color: "#FF5722",
        textColor: "white",
      };
    }
    return marks;
  };

  const handleDayPress = (day: DateData) => {
    const selected = day.dateString;
    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      setSelectedRange({ startDate: selected });
    } else if (
      selectedRange.startDate &&
      dayjs(selected).isAfter(selectedRange.startDate)
    ) {
      setSelectedRange({
        ...selectedRange,
        endDate: selected,
      });
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setChosenLocation(place.structuredFormat.mainText.text);
    setSearchVisible(false);
  };

  const onSaveDates = () => {
    if (selectedRange.startDate) {
      setDisplayStart(selectedRange.startDate);
    }
    if (selectedRange.endDate) {
      setDisplayEnd(selectedRange.endDate);
    }
    setCalendarVisible(false);
  };

  const handleCreateTrip = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!chosenLocation) {
        setError("Please select a location");
        return;
      }
      if (!selectedRange.startDate || !selectedRange.endDate) {
        setError("Please select a valid date range");
        return;
      }
      const clerkUserId = expoUser?.id;
      const email = expoUser?.primaryEmailAddress?.emailAddress;
      if (!clerkUserId || !email) {
        setError("User not authenticated or email missing");
        return;
      }

      let background = tripBackground;
      try {
        const photoRes = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/place-photo`,
          { params: { location: chosenLocation } },
        );
        if (photoRes.data.photoUrl) {
          background = photoRes.data.photoUrl;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Google API error:", error.response?.data);
        }
        console.log("Could not fetch place photo, using placeholder", error);
      }

      const tripData = {
        tripName: chosenLocation,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
        startDay: dayjs(selectedRange.startDate).format("dddd"),
        endDay: dayjs(selectedRange.endDate).format("dddd"),
        clerkUserId,
        background,
        userData: {
          email,
          name: expoUser?.fullName || "",
        },
      };

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips`,
        tripData,
      );
      const createdTrip: Trip = response.data.trip;
      navigation.navigate("PlanTrip", { trip: createdTrip });
    } catch (error) {
      console.log("Error", error);
      setError("Something went wrong creating your trip");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5">
        <View className="mt-2 mb-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" color={"#000"} size={28} />
          </Pressable>
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Plan a new trip
        </Text>
        <Text className="text-base text-gray-500 mb-6">
          Build an itinerary and map out your upcoming travel plans
        </Text>

        <Pressable
          onPress={() => setSearchVisible(true)}
          className="border border-gray-30 rounded-xl px-4 py-3 mb-4"
        >
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Where to?
          </Text>
          <Text className="text-base text-gray-500">
            {chosenLocation || "E.g. Tokyo, Osaka, Kyoto"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCalendarVisible(true)}
          className="flex-row border border-gray-300 rounded-xl px-4 py-3 justify-between mb-4"
        >
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Dates
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar" color={"#000"} size={16} />
              <Text className="text-sm text-gray-500">
                &nbsp;
                {displayStart
                  ? dayjs(displayStart).format("MMM D")
                  : "Start Date"}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1 invisible">
              •
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar" color={"#000"} size={16} />
              <Text className="text-sm text-gray-500">
                &nbsp;
                {displayEnd ? dayjs(displayEnd).format("MMM D") : "End Date"}
              </Text>
            </View>
          </View>
        </Pressable>

        <View className="flex-row justify-between items-center mb-8">
          <Pressable>
            <Text className="text-sm text-gray-600 font-medium">
              + Invite a tripmate
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center">
            <Ionicons name="people" size={16} color={"#666"} />
            <Text className="ml-1 text-sm text-gray-600 font-medium">
              Friends
            </Text>
            <Ionicons name="chevron-down" size={16} color={"#666"} />
          </Pressable>
        </View>

        {error && (
          <Text className="text-red-500 text-sm mb-4 mx-auto">{error}</Text>
        )}

        <Pressable
          onPress={handleCreateTrip}
          className="bg-orange-500 rounded-full py-3 items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Start Planning
            </Text>
          )}
        </Pressable>

        <Text className="text-sm text-gray-500 text-center">
          Or see an example for{" "}
          <Text className="font-semibold text-gray-600">New York</Text>
        </Text>
      </View>

      <Modal animationType="slide" visible={calendarVisible}>
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl w-11/12">
            <Calendar
              markingType="period"
              markedDates={getMarkedDates()}
              onDayPress={handleDayPress}
              minDate={today}
              theme={{
                todayTextColor: "#FF5722",
                arrowColor: "#00BFFF",
                selectedDayTextColor: "#FFF",
              }}
            />
            <Pressable
              onPress={onSaveDates}
              className="p-4 border-t border-gray-200 items-center"
            >
              <Text className="text-gray-700 font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" visible={searchVisible}>
        <SafeAreaView className="flex-1 bg-white pt-10 px-4">
          <View className="flex-row items-center mb-4">
            <Pressable onPress={() => setSearchVisible(false)} className="mr-3">
              <Ionicons name="arrow-back" size={24} color={"#000"} />
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900">
              Search for a place
            </Text>
          </View>
          <GooglePlacesTextInput
            apiKey=""
            proxyUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/autocomplete`}
            placeHolderText="Search for a place"
            onPlaceSelect={handlePlaceSelect}
            style={GoogleSearchStyle}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default NewTripScreen;

const styles = StyleSheet.create({
  inputFocused: {
    borderColor: "transparent",
  },
});
