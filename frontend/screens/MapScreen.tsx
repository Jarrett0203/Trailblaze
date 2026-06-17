import { StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MapHandle } from "../types/MapComponent";
import MapComponent from "../components/MapComponent";
import PlaceCardList from "../components/PlaceCardList";

type MapRouteParams = {
  MapScreen: {
    places: PlaceToVisit[];
  };
};

const MapScreen = () => {
  const route = useRoute<RouteProp<MapRouteParams, "MapScreen">>();
  const places = route?.params.places || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mapRef = useRef<MapHandle>(null);

  useEffect(() => {
    if (places.length > 0 && mapRef.current) {
      mapRef.current.fitToPlaces(places);
    }
  }, []);

  return (
    <View className="flex-1">
      <MapComponent
        ref={mapRef}
        places={places}
        selectedIndex={selectedIndex}
      />

      <View
        className="absolute flex-1 bottom-6 left-0 right-0"
        pointerEvents="box-none"
        style={{ zIndex: 100, width:'100%' }}
      >
        <View pointerEvents="auto">
          <PlaceCardList
            places={places}
            onIndexChange={(index) => {
              setSelectedIndex(index);
              mapRef.current?.moveToPlace(places[index]);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
