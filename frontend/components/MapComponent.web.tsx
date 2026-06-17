import { StyleSheet, Text, View } from "react-native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { MapComponentProps, MapHandle } from "../types/MapComponent";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = forwardRef<MapHandle, MapComponentProps>(
  ({ places, selectedIndex }, ref) => {
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY!,
    });

    // Stable initial center — never changes, so re-renders won't reset the map
    const initialCenter = useRef({
      lat: places[0]?.location.latitude ?? 35.652832,
      lng: places[0]?.location.longitude ?? 139.839478,
    });

    useImperativeHandle(ref, () => ({
      fitToPlaces(places) {
        if (!mapRef.current || !window.google) return;
        const bounds = new window.google.maps.LatLngBounds();
        places.forEach((p) =>
          bounds.extend({
            lat: p.location.latitude,
            lng: p.location.longitude,
          }),
        );
        mapRef.current?.fitBounds(bounds, {
          top: 150,
          right: 150,
          bottom: 150,
          left: 150,
        });
      },
      moveToPlace(place) {
        mapRef.current?.panTo({
          lat: place.location.latitude,
          lng: place.location.longitude,
        });
        mapRef.current?.setZoom(14);
      },
    }));

    const onMapLoad = useCallback(
      (map: google.maps.Map) => {
        mapRef.current = map;
        if (places.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          places.forEach((p) =>
            bounds.extend({
              lat: p.location.latitude,
              lng: p.location.longitude,
            }),
          );
          map.fitBounds(bounds, {
            top: 150,
            right: 150,
            bottom: 150,
            left: 150,
          });
        }
      },
      [],
    );

    if (!isLoaded) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text>Loading map...</Text>
        </View>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={initialCenter.current}
        zoom={12}
        onLoad={onMapLoad}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.location.latitude,
              lng: place.location.longitude,
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: index === selectedIndex ? 12 : 8,
              fillColor: index === selectedIndex ? "#007AFF" : "#FF3B30",
              fillOpacity: 1,
              strokeColor: "#FFF",
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
    );
  },
);

export default MapComponent;

const styles = StyleSheet.create({});
