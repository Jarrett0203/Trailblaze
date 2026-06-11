import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { RouteProp, useRoute } from "@react-navigation/native";
import MapView, { Marker, Region } from "react-native-maps";
import { CARD_WIDTH, SPACING } from "../common/MapVariables";
import { tripBackground } from "../types/Trip";

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

  useEffect(() => {
    if(places.length > 0 && mapRef.current) {
      const coordinates = places?.map((place) => ({
        latitude: place.location.latitude,
        longitude: place.location.longitude
      }))

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 150,
          right: 150,
          bottom: 150,
          left: 150
        },
        animated: true
      })
    }
  }, [])

  const moveToRegion = (place: PlaceToVisit) => {
    const region: Region = {
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    }
    mapRef.current?.animateToRegion(region, 350);
  }

  const onCardScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    )
    if (index !== selectedIndex && places[index]) {
      setSelectedIndex(index);
      moveToRegion(places[index]);
    }
  }

  return (
    <View className='flex-1'>
      <MapView ref={mapRef} style={{flex: 1, height: "100%"}} initialRegion={{
        latitude: places[0].location.latitude ?? 35.652832,
        longitude: places[0].location.longitude ?? 139.839478,
        latitudeDelta: 1,
        longitudeDelta: 1
      }}>
        {places?.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
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

      <View className="absolute bottom-6">
        <FlatList
        ref={flatListRef}
        data={places}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        decelerationRate={"fast"}
        contentContainerStyle={{
          paddingHorizontal: SPACING
        }}
        onScroll={onCardScroll} 
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl shadow-lg p-4" style={{width: CARD_WIDTH, marginRight: SPACING}}>
            <Text> {item?.name || "Unknown place"} </Text>
            {item.briefDescription && (
              <Text className="text-sm text-gray-500 mt-1">
                {item?.briefDescription}
              </Text>
            )}

            {item.photos?.[0] && (
              <Image
                source={{ uri: item.photos[0] || tripBackground}}
                className="h-24 w-full rounded-lg mt-2"
                resizeMode="cover" 
              />
            )}
          </View>
        )}
        />
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
