import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { Trip } from "../types/Trip";
import { PlanTripStackParamsList } from "../navigation/PlanTripStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type FabMenuProps = {
  trip: Trip;
  navigation: NativeStackNavigationProp<PlanTripStackParamsList>;
};

const FabMenu = (props: FabMenuProps) => {
  const { trip, navigation } = props;

  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setIsOpen(!isOpen);
  };

  const aiButtonStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -132],
        }),
      },
      { scale: animation },
    ],
  };

  const mapButtonStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -66],
        }),
      },
      { scale: animation },
    ],
  };

  const rotateStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };
  return (
    <View className="absolute right-4 bottom-20 space-y-3 items-end">
      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[{ position: "absolute", bottom: 0 }, aiButtonStyle]}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("AIChat", { tripName: trip?.tripName })
          }
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to bg-purple-600 items-center justify-center shadow"
        >
          <MaterialIcons name="auto-awesome" size={24} color={"#fff"} />
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[{ position: "absolute", bottom: 0 }, mapButtonStyle]}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("MapScreen", {
              places: trip.placesToVisit || [],
            })
          }
          className="w-12 h-12 rounded-full bg-gradient-to-tr bg-black items-center justify-center shadow mt-2"
        >
          <Ionicons name="map" size={24} color={"#fff"} />
        </Pressable>
      </Animated.View>

      <Pressable
        onPress={toggleMenu}
        className="w-12 h-12 rounded-full bg-gradient-to-tr bg-black items-center justify-center shadow mt-2"
      >
        <Animated.View style={rotateStyle}>
          <Ionicons name="add" size={24} color={"#fff"} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FabMenu;

const styles = StyleSheet.create({});
