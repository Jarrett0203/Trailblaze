import { PlaceDetailsFields } from "react-native-google-places-textinput";
import { Photo } from "../types/Photo";
import { Review } from "../types/Review";
import { truncate } from "./String";
import { PlaceToVisit } from "../types/PlaceToVisit";

export function formatPlaceData(details: PlaceDetailsFields): PlaceToVisit {
  return {
    name: details.displayName?.text || "Unknown place",
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
}
