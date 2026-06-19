import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Trip } from "../types/Trip";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { ModalMode } from "../screens/PlanTripScreen";
import { generateTripDates } from "../common/Date";
import PlaceToVisitCard from "./PlaceToVisitCard";

type ItineraryViewProps = {
  trip: Trip;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  setModalMode: (modalMode: ModalMode) => void;
  setModalVisible: (modalVisible: boolean) => void
};

const ItineraryView = (props: ItineraryViewProps) => {
  const { trip, selectedDate, setSelectedDate, setModalMode, setModalVisible } = props;

  const dates = generateTripDates(trip);

  return (
    <ScrollView className="px-4 pt-4 bg-white">
      <Pressable className="bg-blue-500 rounded-lg mb-4 items-center">
        <View className="flex-row items-center p-3 gap-2">
          <MaterialIcons name="auto-awesome" size={20} color={"#fff"} />
          <Text className="text-white font-medium ml-2">
            Use AI to create itinerary
          </Text>
        </View>
      </Pressable>

      <View className="flex-row mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates?.map((date, index) => (
            <Pressable
              onPress={() => setSelectedDate(date.value)}
              className={`px-4 py-2 mr-2 rounded-lg ${selectedDate === date.value ? "bg-blue-500" : "bg-gray-100"}`}
              key={index}
            >
              <Text
                className={`font-semibold text-sm ${selectedDate === date.value ? "text-white" : "text-gray-700"}`}
              >
                {date.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {dates?.map((date, index) => {
        const itineraryForDate = (trip.itinerary || []).find(
          (item: any) => item.date === date.value,
        );
        const activities = itineraryForDate?.activities || [];
        return (
          <View key={index} className="mb-8">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl font-extrabold mr-2">
                {date?.label}
              </Text>
              <Text className="text-gray-400 font-medium">Add Subheading</Text>
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-blue-600 text-sm font-semibold">
                + Auto-fill day
              </Text>
              <Text className="text-blue-600 text-sm font-semibold">
                Optimize route
              </Text>
              <Text className="text-xs bg-orange-400 text-white px-1.5 py-0.5 rounded">
                PRO
              </Text>
            </View>

            {activities.length > 0 ? (
              activities.map((place: PlaceToVisit, index: number) => (
                <PlaceToVisitCard place={place} />
              ))
            ) : (
              <Text className="text-sm text-gray-500 mb-3">
                No activities added for this date
              </Text>
            )}

            <TouchableOpacity onPress={() => {
              setSelectedDate(date.value);
              setModalMode("place");
              setModalVisible(true);
            }} className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-3">
              <Ionicons name="location-outline" size={18} color={'#777'} />
              <Text className="ml-2 text-gray-500">Add a place</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ItineraryView;

const styles = StyleSheet.create({});
