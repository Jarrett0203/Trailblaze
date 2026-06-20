import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { PlaceToVisit } from "../types/PlaceToVisit";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import PlaceToVisitField from "./PlaceToVisitField";
import { getCategories, PLACE_TYPE_CATEGORIES, PlaceTypeCategory } from "../common/AllowedPlaceCategories";

type PlaceToVisitCardProps = {
  place: PlaceToVisit;
};

const PlaceToVisitCard = (props: PlaceToVisitCardProps) => {
  const { place } = props;
  const [activePlace, setActivePlace] = useState<PlaceToVisit | null>(null);
  function renderStars(rating: number) {
    const stars = [];
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color={"#FFD700"} />,
        );
      } else if (i === filledStars && halfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color={"#FFD700"} />,
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color={"#FFD700"} />,
        );
      }
    }

    return stars;
  }

  function getAverageRating(
    reviews: { authorName: string; rating: number; text: string }[],
  ) {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }

  function getOpeningHoursToday(openingHours: string[]) {
    if (!openingHours || openingHours.length === 0) {
      return "Opening hours unavailable!";
    }
    const today = dayjs().format("dddd").toLowerCase();
    const todayHours = openingHours.find((line) =>
      line.toLowerCase().toString().startsWith(today),
    );
    return todayHours || openingHours[0];
  }

  const avgRating = getAverageRating(place.reviews);

  return (
    <View className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <Pressable
        onPress={() =>
          setActivePlace(
            activePlace && activePlace.name === place?.name ? null : place,
          )
        }
        className="flex-row items-center"
      >
        <Image
          className="w-24 h-24 rounded-l-xl"
          source={{ uri: place.photos[0] }}
        />
        <View className="flex-1 p-3">
          <Text className="text-gray-600 font-bold text-base mb-1">
            {place.name}
          </Text>
          <Text className="text-gray-600 text-sm leading-5" numberOfLines={2}>
            {place.briefDescription || "No description available"}
          </Text>
          <View className="flex-row items-center mt-1">
            {renderStars(avgRating)}
            <Text className="text-xs text-gray-500 mt-1 ml-1">
              {avgRating}/5
            </Text>
          </View>
        </View>
      </Pressable>

      {activePlace && activePlace.name === place?.name && (
        <View className="p-4 bg-gray-50 border-t border-gray-200">
          <PlaceToVisitField field="Address" iconName="location">
            <Text className="text-sm text-gray-600 mt-1">
              {place.formattedAddress}
            </Text>
          </PlaceToVisitField>

          {place.openingHours?.length > 0 && (
            <PlaceToVisitField field="Opening Hours" iconName="time">
              <Text className="text-sm text-gray-600 mt-1">
                {getOpeningHoursToday(place.openingHours)}
              </Text>
            </PlaceToVisitField>
          )}

          {place.phoneNumber && (
            <PlaceToVisitField field="Phone" iconName="call">
              <Text className="text-sm text-gray-600 mt-1">
                {place.phoneNumber}
              </Text>
            </PlaceToVisitField>
          )}

          {place.website && (
            <PlaceToVisitField field="Website" iconName="globe">
              <Text
                className="text-sm text-blue-500 underline mt-1"
                numberOfLines={2}
              >
                {place.website}
              </Text>
            </PlaceToVisitField>
          )}

          {place.reviews.length > 0 && (
            <PlaceToVisitField field="Review" iconName="star">
              <Text className="text-sm text-gray-600 italic mt-1">
                "{place.reviews[0].text.slice(0, 100)}
                {place.reviews[0].text.length > 100 ? "..." : ""}"
              </Text>
              <View className="flex-row items-center mt-1">
                {renderStars(place.reviews[0].rating)}
                <Text className="text-xs text-gray-500 ml-1">
                  - {place.reviews[0].authorName}&nbsp;{place.reviews[0].rating}/5
                </Text>
              </View>
            </PlaceToVisitField>
          )}

          {
            place.types.length > 0 && (
              <PlaceToVisitField field="Categories" iconName="pricetag">
                <View className="flex-row flex-wrap mt-1">
                  {getCategories(place.types).map((categoryLabel: PlaceTypeCategory) => {
                    const tagClassName = PLACE_TYPE_CATEGORIES[categoryLabel].color;

                    return (
                      <View
                        key={categoryLabel}
                        className={`px-3 py-1 rounded-full mr-2 mb-1 ${tagClassName}`}
                      >
                        <Text className='text-xs font-medium capitalize'>{categoryLabel}</Text>
                      </View>
                    );
                  })}
                </View>
              </PlaceToVisitField>
            )
          }
        </View>
      )}
    </View>
  );
};

export default PlaceToVisitCard;

const styles = StyleSheet.create({});
