import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Trip } from "../types/Trip";
import { generateTripDates } from "../common/Date";

type PlaceSelectionProps = {
  trip: Trip;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
};

const PlaceSelectionList = (props: PlaceSelectionProps) => {
  const { trip, selectedDate, setSelectedDate } = props;

  return (
    <>
      <Text className="text-sm font-semibold mt-2 mb-1">Select Date</Text>
      <View className="flex-row items-center gap-2">
        {generateTripDates(trip).map((date, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedDate(date.value)}
            className={`px-3 py-1.5 mr-2 rounded-full border ${selectedDate === date.value ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}
          >
            <Text
              className={`text-xs font-medium ${selectedDate === date.value ? "text-white" : "text-gray-700"}`}
            >
              {date.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
};

export default PlaceSelectionList;

const styles = StyleSheet.create({});
