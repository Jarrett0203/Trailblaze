import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { MapComponentProps, MapHandle } from "../types/MapComponent";
import MapView, { Marker, Region } from "react-native-maps";

const MapComponent = forwardRef<MapHandle, MapComponentProps>(
  ({ places, selectedIndex }, ref) => {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      fitToPlaces(places) {
        const coordinates = places.map((p) => ({
          latitude: p.location.latitude,
          longitude: p.location.longitude,
        }));
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 150, right: 150, bottom: 150, left: 150 },
          animated: true,
        });
      },
      moveToPlace(place) {
        const region: Region = {
          latitude: place.location.latitude,
          longitude: place.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current?.animateToRegion(region, 350);
      },
    }));

    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1, height: "100%" }}
        initialRegion={{
          latitude: places[0].location.latitude ?? 35.652832,
          longitude: places[0].location.longitude ?? 139.839478,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        {places?.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
            }}
          >
            <View
              style={{
                backgroundColor:
                  index === selectedIndex ? "#007AFF" : "#FF3B30",
                padding: index === selectedIndex ? 10 : 6,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#FFF",
              }}
            ></View>
          </Marker>
        ))}
      </MapView>
    );
  },
);

export default MapComponent;

const styles = StyleSheet.create({});
