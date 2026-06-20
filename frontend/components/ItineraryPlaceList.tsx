import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PlaceToVisit } from "../types/PlaceToVisit";

type ItineraryPlaceListProps = {
  title: string,
  places: PlaceToVisit[],
  selectedDate: string | null,
  handleAddPlaceToItinerary: (place: PlaceToVisit, selectedDate: string) => void,
  setError: (error: string) => void
}


const ItineraryPlaceList = (props: ItineraryPlaceListProps) => {
  const {title, places, selectedDate, handleAddPlaceToItinerary, setError} = props;
  
  return (
    <View className="flex-1 mt-2">
      <Text className="text-sm font-semibold mb-1">
        {title}
      </Text>
      <ScrollView className="flex-1">
        {places.map((place: PlaceToVisit, index: number) => (
          <Pressable
            key={index}
            onPress={() => {
              if (selectedDate) {
                handleAddPlaceToItinerary(place, selectedDate);
              } else {
                setError("Please select a date to add this place");
              }
            }}
            className="flex-row items-center p-2 border-b border-gray-200"
          >
            <Image
              className="w-12 h-12 rounded-md mr-2"
              source={{ uri: place?.photos[0] }}
            />
            <View>
              <Text className="text-sm font-medium">{place?.name}</Text>
              <Text className="text-xs text-gray-500">
                {place?.formattedAddress}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default ItineraryPlaceList;

const styles = StyleSheet.create({});
