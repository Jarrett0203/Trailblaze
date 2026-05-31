import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

export const weekendPlaces = [
  {
    id: "1",
    name: "Tokyo",
    image:
      "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    name: "Kyoto",
    image:
      "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Osaka",
    image:
      "https://images.unsplash.com/photo-1584505489290-96eb4e406d08?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    name: "Hiroshima",
    image:
      "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=1033&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    name: "Nara",
    image:
      "https://plus.unsplash.com/premium_photo-1723983556753-720945de2973?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    name: "Sapporo",
    image:
      "https://images.unsplash.com/photo-1584005679717-7dda5e88bb52?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


const WeekendTrips = () => {
  return (
    <View className="mt-2">
      <ScrollView horizontal showsHorizontalScrollIndicator>
        {weekendPlaces?.map((place) => (
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
