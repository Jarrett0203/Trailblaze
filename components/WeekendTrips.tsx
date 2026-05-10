import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { places } from "../types/Place";

const WeekendTrips = () => {
  return (
    <View className="mt-2">
      <ScrollView horizontal showsHorizontalScrollIndicator>
        {places?.map((place) => (
          <View className="mr-4 relative" key={place.id}>
            <Image
              className="w-40 h-52 rounded-2xl"
              source={{ uri: place.image }}
            />
            <View className="absolute bottom-0 left-0 right-0 h-14 rounded-b-2xl justify-center items-center">
              <Text className="text-white font-bold text-xl">{place.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default WeekendTrips;

const styles = StyleSheet.create({});
