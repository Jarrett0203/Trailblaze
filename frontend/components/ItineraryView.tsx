import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { ModalMode } from "../screens/PlanTripScreen";
import { generateTripDates } from "../common/Date";
import PlaceToVisitCard from "./PlaceToVisitCard";
import axios, { AxiosError } from "axios";
import { GoogleGenAI } from "@google/genai";
import { Trip } from "../types/Trip";

type ItineraryViewProps = {
  trip: Trip;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  setModalMode: (modalMode: ModalMode) => void;
  setModalVisible: (modalVisible: boolean) => void;
  setAiPlaces: (places: PlaceToVisit[]) => void;
  setError: (error: string) => void;
};

const ItineraryView = (props: ItineraryViewProps) => {
  const {
    trip,
    selectedDate,
    setSelectedDate,
    setModalMode,
    setModalVisible,
    setAiPlaces,
    setError,
  } = props;

  const [aiLoading, setAiLoading] = useState(false);

  const dates = generateTripDates(trip);
  const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  });

  async function fetchAPIPlaces() {
    setAiLoading(true);
    setError("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are a helpful travel assistant for ${trip.tripName}, return a json array of 5 objects, each representing a top place to visit. 
              Each object must have exactly these fields: "name" (string), "description" (string, 50-100 words), "address" (string). Ensure the response
              has no backticks, markdown or extra text. Example: [{"name":"Place 1", "description":"A beautiful place...", "address":"123 Main St"}] `,
      });
      const responseText = response.text
        ?.trim()
        .replace(/```json\n?|\n?```/g, "");
      const jsonMatch = responseText?.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("JSON array not found!");
      }

      let places;
      try {
        places = JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error("Error in parsing AI response", error);
      }

      if (!Array.isArray(places) || places.length === 0) {
        throw new Error(
          "AI response missing required fields (name, desc, address)",
        );
      }

      const placesWithDetails = await Promise.all(
        places.map(async (place): Promise<PlaceToVisit | undefined> => {
          let placeId;
          try {
            const photoRes = await axios.get(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/text-search`,
              { params: { location: place.name } },
            );
            placeId = photoRes.data.placeId;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error("Google API error:", error.response?.data);
            }
            console.error("Could not fetch place id", error);
          }

          try {
            const placeDetails = await axios.get(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/details/${placeId}`,
              {
                params: {
                  formatted: "true",
                },
                headers: {
                  "X-Goog-FieldMask": [
                    "id",
                    "displayName",
                    "internationalPhoneNumber",
                    "websiteUri",
                    "currentOpeningHours",
                    "photos",
                    "reviews",
                    "types",
                    "formattedAddress",
                    "editorialSummary",
                    "addressComponents",
                    "location",
                    "viewport",
                  ].join(","),
                },
              },
            );
            if (!placeDetails) {
              throw new Error(`No details found for ${place.name}`);
            }

            return placeDetails.data;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error("Error fetching ai places", error.message);
              setError("Failed to fetch AI recommendations!");
            }
          }

          return undefined;
        }),
      );

      const validPlacesWithDetails = placesWithDetails.filter(
        (place): place is PlaceToVisit => Boolean(place),
      );

      setAiPlaces(validPlacesWithDetails);
      setAiLoading(false);
      setModalMode("ai");
      setModalVisible(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching AI places", error.message);
        setError("Failed to fetch AI Recommendations");
      }
    }
  }

  return (
    <ScrollView className="px-4 pt-4 bg-white">
      <Pressable
        disabled={aiLoading}
        onPress={fetchAPIPlaces}
        className="bg-blue-500 rounded-lg mb-4 items-center"
      >
        <View className="flex-row items-center p-3 gap-2">
          {aiLoading ? (
            <ActivityIndicator size={"small"} color={"#fff"} />
          ) : (
            <MaterialIcons name="auto-awesome" size={20} color={"#fff"} />
          )}
          <Text className="text-white font-medium ml-2">
            {aiLoading ? "Fetching AI Suggestions" : "Get AI Suggestions"}
          </Text>
        </View>
      </Pressable>

      <View className="flex-row mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates?.map((date, index) => (
            <Pressable
            key={index}
              onPress={() => setSelectedDate(date.value)}
              className={`px-4 py-2 mr-2 rounded-lg ${selectedDate === date.value ? "bg-blue-500" : "bg-gray-100"}`}
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
                ✈ Auto-fill day
              </Text>
              <Text className="text-blue-600 text-sm font-semibold">
                🚩 Optimize route
              </Text>
              <Text className="text-xs bg-orange-400 text-white px-1.5 py-0.5 rounded">
                PRO
              </Text>
            </View>

            {activities.length > 0 ? (
              activities.map((place: PlaceToVisit, index: number) => (
                <PlaceToVisitCard key={index} place={place} />
              ))
            ) : (
              <Text className="text-sm text-gray-500 mb-3">
                No activities added for this date
              </Text>
            )}

            <Pressable
              onPress={() => {
                setSelectedDate(date.value);
                setModalMode("place");
                setModalVisible(true);
              }}
              className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-3"
            >
              <Ionicons name="location-outline" size={18} color={"#777"} />
              <Text className="ml-2 text-gray-500">Add a place</Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ItineraryView;

const styles = StyleSheet.create({});
