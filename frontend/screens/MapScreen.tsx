import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { RouteProp, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

type MapRouteParams = {
  MapScreen: {
    places: PlaceToVisit[];
  };
};

const MapScreen = () => {
  const route = useRoute<RouteProp<MapRouteParams, "MapScreen">>();
  const places = route?.params.places || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  return (
    <View className='flex-1'>
      <MapView ref={mapRef} style={{flex: 1, height: "100%"}} initialRegion={{
        latitude: places[0].location.lat ?? 35.652832,
        longitude: places[0].location.lng ?? 139.839478,
        latitudeDelta: 1,
        longitudeDelta: 1
      }}>
        {places?.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.location.lat,
              longitude: place.location.lng,
            }}
          >
            <View style={{
              backgroundColor: index === selectedIndex ? "#007AFF" : "#FF3B30",
              padding: index === selectedIndex ? 10 : 6,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#FFF'
            }}>

            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
