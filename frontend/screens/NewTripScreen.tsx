import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, DateData } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

type DateRange = {
  startDate?: string;
  endDate?: string;
};

const NewTripScreen = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({});
  const [displayStart, setDisplayStart] = useState("");
  const [displayEnd, setDisplayEnd] = useState("");
  const [searchVisible, setSearchVisible] = useState("");
  const [chosenLocation, setChosenLocation] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const today = dayjs().format("YYYY-MM-DD");

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

  const onSaveDates = () => {
    if (selectedRange.startDate) {
      setDisplayStart(selectedRange.startDate);
    }
    if (selectedRange.endDate) {
      setDisplayEnd(selectedRange.endDate);
    }
    setCalendarVisible(false);
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

        <Pressable className="border border-gray-30 rounded-xl px-4 py-3 mb-4">
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
              Dates (optional)
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar" color={"#000"} size={16} />
              <Text className="text-sm text-gray-500">
                &nbsp;{displayStart
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
                &nbsp;{displayEnd ? dayjs(displayEnd).format("MMM D") : "End Date"}
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

        {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

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
    </SafeAreaView>
  );
};

export default NewTripScreen;

const styles = StyleSheet.create({});
