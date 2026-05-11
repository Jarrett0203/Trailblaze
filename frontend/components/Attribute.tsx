import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type AttributeProps = {
  attribute: string;
  attributeIcon: AttributeIcon;
};

export enum AttributeIcon {
  Location = "location-outline",
  Type = "map-outline",
  BestTime = "calendar-outline",
  Attractions = "star-outline",
  EntryFee = "cash-outline"
}

const Attribute = (props: AttributeProps) => {
  const { attribute, attributeIcon } =
    props;
  return (
    <View className="flex-row items-center mb-2">
      <Ionicons name={attributeIcon} size={16} color="#FF5722" />
      <Text className="text-gray-800 text-sm font-medium ml-2">
        {attribute}
      </Text>
    </View>
  );
};

export default Attribute;

const styles = StyleSheet.create({});
