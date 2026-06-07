import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamsList } from "../navigation/HomeStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { tripBackground } from "../types/Trip";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { placeholderProfileImageUrl } from "./ProfileScreen";
import Accordion from "../components/Accordion";
import { PlanTripStackParamsList } from "../navigation/PlanTripStack";
import { ProfileStackParamsList } from "../navigation/ProfileStack";
import Modal from "react-native-modal";
import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";
import { GoogleSearchStyle } from "../common/GoogleSearchStyle";
import { Photo } from "../types/Photo";
import { Review } from "../types/Review";
import axios, { AxiosError } from "axios";
import { PlaceToVisit } from "../types/PlaceToVisit";
import PlaceToVisitCard from "../components/PlaceToVisitCard";
import { IoniconsGlyphs } from "../types/IoniconGlyphs";
import { truncate } from "../common/String";

type ModalMode = "place" | "expense" | "editExpense" | "ai";

const categories = [
  "Flight",
  "Lodging",
  "Shopping",
  "Activities",
  "Sightseeing",
  "Drinks",
  "Food",
  "Transportation",
  "Entertainment",
  "Miscelleaneous",
];

const splitOptions = [
  { label: "Don't split", value: "Don't Split" },
  { label: "Everyone", value: "Everyone" },
];

const tripTabs = ["Overview", "Itinerary", "Explore", "$"];

const cards = [
  {
    title: "Add a reservation",
    subtitle: "Forward an email or add reservation details",
  },
  {
    title: "Explore things to do",
    subtitle: "Add places from top blogs",
  },
];



const labels: { label: string; icon: IoniconsGlyphs }[] = [
  { label: "Flight", icon: "airplane" },
  { label: "Lodging", icon: "bed" },
  { label: "Rental car", icon: "car" },
  { label: "Restaurant", icon: "restaurant" },
  { label: "Attachment", icon: "attach" },
  { label: "Other", icon: "ellipsis-horizontal" },
];

const PlanTripScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PlanTripStackParamsList>>();
  const route =
    useRoute<
      RouteProp<HomeStackParamsList | ProfileStackParamsList, "PlanTrip">
    >();
  const { trip: initialTrip } = route.params;
  const [trip, setTrip] = useState(initialTrip);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("place");
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const { user: expoUser } = useUser();
  const { getToken } = useAuth();

  const handlePlaceToItinerary = async (
    placeData: PlaceToVisit,
    selectedDate,
  ) => {};

  const fetchTrips = useCallback(async () => {
    const clerkUserId = expoUser?.id;
    if (!clerkUserId || !trip._id) {
      setError("User or trip id is missing!");
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips/${trip._id}`,
        {
          params: { clerkUserId },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTrip(response.data.trip);
      setError("");
    } catch (error) {
      console.error("Fetch trips error", error);
    }
  }, [trip._id, expoUser]);

  const handleAddPlace = async (placeId: string) => {
    if (!placeId || !trip._id) {
      setError("Place id and trip id are required!");
      return;
    }

    console.log("add place", placeId);

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/trips/${trip._id}/places`,
        { placeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchTrips();
      setModalVisible(false);
      setSelectedDate(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Add place error:", error.response?.data.error);
        setError(error.response?.data.error);
      }
    }
  };

  const handlePlaceSelect = async (place: Place) => {
    console.log("Selected place:", place);
    const placeId = place.placeId;
    const details = place.details;
    console.log(details);

    if (!details) {
      throw new Error("Could not retrieve place details!");
    }

    const placeData = {
      name: details.displayName?.text || "Undefined place",
      phoneNumber: details.internationalPhoneNumber || "",
      website: details.websiteUri,
      openingHours: details.currentOpeningHours?.weekdayDescriptions || [],
      photos: (details.photos || []).map(
        (photo: Photo) =>
          `${process.env.EXPO_PUBLIC_BACKEND_URL}?photoName=${encodeURIComponent(photo.name)}&maxWidthPx=800`,
      ),
      reviews: (details.reviews || []).map((review: Review) => ({
        authorName: review.authorAttribution?.displayName || "Unknown",
        rating: review.rating || 0,
        text: review.text?.text || "",
      })),
      types: details.types || [],
      formattedAddress: details.formattedAddress || "No address available",
      briefDescription:
        truncate(details.editorialSummary?.text) ||
        `Located in ${details.addressComponents?.[2]?.longText || details.formattedAddress || "this area"}.`,
      location: details.location || { latitude: 0, longitude: 0 },
      viewport: details.viewport || {
        low: { latitude: 0, longitude: 0 },
        high: { latitude: 0, longitude: 0 },
      },
    };

    if (selectedDate) {
      await handlePlaceToItinerary(placeData, selectedDate);
    } else {
      await handleAddPlace(placeId);
    }
  };

  const handlePlaceError = (error: any) => {
    console.error("Google Places API Error", error);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips]),
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative w-full h-48">
        <Image
          className="h-full w-full"
          source={{ uri: trip?.background || tripBackground }}
        />
        <Pressable className="absolute bottom-[-32px] left-4 right-4 bg-white p-4 rounded-xl shadow-md flex-row justify-between items-center">
          <Ionicons name="arrow-back" color="#000" size={28} />
        </Pressable>
        <View className="absolute bottom-[-32px] left-4 right-4 bg-white p-4 rounded-xl shadow-md flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-semibold">
              Trip to {trip?.tripName || "Unnamed Trip"}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {trip?.startDate ? dayjs(trip?.startDate).format("MMM D") : "N/A"}{" "}
              -&nbsp;
              {trip?.endDate ? dayjs(trip?.endDate).format("MMM D") : "N/A"}
            </Text>
          </View>
          <View className="items-center">
            <Image
              className="w-8 h-8 rounded-full mb-1"
              source={{ uri: expoUser?.imageUrl || placeholderProfileImageUrl }}
            />
            <Pressable className="bg-black rounded-full px-3 py-1">
              <Text className="text-white text-xs">Share</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="flex-row px-4 mt-12 border-b border-gray-200">
        {tripTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`mr-6 pb-2 ${selectedTab === tab ? "border-b-2 border-orange-500" : ""}`}
          >
            <Text>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {selectedTab === "Overview" && (
        <ScrollView className="px-4 pt-4">
          <View className="mb-6 bg-white rounded-lg p-4">
            <Text className="text-sm text-gray-500 mb-1">
              Trailblaze level: Basic
            </Text>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View className="w-1/4 h-full bg-blue-500" />
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            {cards.map((card) => (
              <View
                key={card.title}
                className="w-[48%] bg-white p-4 rounded-lg shadow-sm"
              >
                <Text className="font-semibold mb-2 text-sm">{card.title}</Text>
                <Text className="text-xs text-gray-500 mb-3">
                  {card.subtitle}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-blue-500 text-xs font-medium">
                    Skip
                  </Text>
                  <Text className="text-blue-500 text-xs font-medium">
                    Start
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mb-6 bg-white rounded-lg p-4">
            <Text className="font-semibold mb-3 text-base">
              Reservations and attachments
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {labels.map((item) => (
                <View key={item.label} className="items-center mr-6">
                  <Ionicons name={item.icon} size={24} />
                  <Text className="text-xs mt-1">{item.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <Accordion
            header="Notes"
            description={
              <Text className="text-gray-500 text-sm">
                Write or paste general notes here, e.g. how to get around, local
                trips, reminders
              </Text>
            }
          />
          <Accordion
            header="Places to Visit"
            description={
              <>
                {(trip?.placesToVisit || []).map((place: PlaceToVisit) =>
                  <PlaceToVisitCard key={place.name} place={place} />,
                )}
                {(trip?.placesToVisit || trip?.placesToVisit.length === 0) && (
                  <Text className="text-gray-500 text-sm">
                    No places added yet
                  </Text>
                )}

                <Pressable
                  onPress={() => {
                    setSelectedDate(null);
                    setModalMode("place");
                    setModalVisible(true);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 mt-2"
                >
                  <Text className="text-sm text-gray-500">Add a place</Text>
                </Pressable>
              </>
            }
          />
        </ScrollView>
      )}
      <View className="absolute right-4 bottom-20 space-y-3 items-end">
        <Pressable
          onPress={() =>
            navigation.navigate("AIChat", { tripName: trip?.tripName })
          }
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to bg-purple-600 items-center justify-center shadow"
        >
          <MaterialIcons name="auto-awesome" size={24} color={"#fff"} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("MapScreen", {places: trip.placesToVisit || []})} className="w-12 h-12 rounded-full bg-gradient-to-tr bg-black items-center justify-center shadow mt-2">
          <Ionicons name="map" size={24} color={"#fff"} />
        </Pressable>
        <Pressable className="w-12 h-12 rounded-full bg-gradient-to-tr bg-black items-center justify-center shadow mt-2">
          <Ionicons name="add" size={24} color={"#fff"} />
        </Pressable>
      </View>

      {/* replace with react-native modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setSelectedDate(null);
          setModalMode("place");
        }}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        {modalMode === "place" || modalMode === "ai"} ? (
        <View className="bg-white p-4 rounded-t-2xl h-[60%]">
          {modalMode === "place" && selectedTab !== "Itinerary" && (
            <>
              <Text className="text-lg font-semibold mb-4">
                {selectedDate
                  ? `Add place to ${dayjs(selectedDate).format("ddd D/M")}`
                  : "Search for a place"}
              </Text>
              <GooglePlacesTextInput
                apiKey=""
                proxyUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/autocomplete`}
                placeHolderText="Search for a place"
                languageCode="en"
                onPlaceSelect={handlePlaceSelect}
                onError={handlePlaceError}
                style={GoogleSearchStyle}
                fetchDetails={true}
                detailsFields={[
                  "id",
                  "displayName",
                  "internationalPhoneNumber",
                  "websiteUri",
                  "currentOpeningHours",
                  "photos",
                  "reviews",
                  "types",
                  "formattedAddress",
                  "editorialSummary",
                  "addressComponents",
                  "location",
                  "viewport",
                ]}
                detailsProxyUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/places/details`}
              />
            </>
          )}
        </View>
        )
      </Modal>
    </SafeAreaView>
  );
};

export default PlanTripScreen;

const styles = StyleSheet.create({});
