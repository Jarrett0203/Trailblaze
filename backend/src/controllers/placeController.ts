import axios from "axios";
import { Photo } from "../types/Photo";
import { truncate } from "../common/string";
import { Request, Response } from "express";
import { Review } from "../types/Review";

export async function fetchPlaceDetails(
  placeId: string,
  formatted: boolean,
  fieldMask?: string,
) {
  const res = await axios.get(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": fieldMask
          ? fieldMask
          : "id,displayName,internationalPhoneNumber,websiteUri,currentOpeningHours,photos,reviews,types,formattedAddress,editorialSummary,addressComponents,location,viewport",
      },
    },
  );

  const details = res.data;
  if (!details) throw new Error("Failed to fetch place details");
  if (!formatted) {
    return details;
  }

  return {
    name: details.displayName?.text || "Unknown place",
    phoneNumber: details.internationalPhoneNumber || "",
    website: details.websiteUri,
    openingHours: details.currentOpeningHours?.weekdayDescriptions || [],
    photos: (details.photos || []).map(
      (photo: Photo) =>
        `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${process.env.GOOGLE_API_KEY}`,
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

export const autoComplete = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ error: "Failed to fetch autocomplete results" });
  }
};

export const getPhoto = async (req: Request, res: Response) => {
  const { photoName, maxWidthPx = 800 } = req.query;

  if (!photoName) {
    return res.status(400).json({ error: "Photo name is required!" });
  }

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/${photoName}/media`,
      {
        params: {
          maxWidthPx,
          key: process.env.GOOGLE_API_KEY,
          skipHttpRedirect: true,
        },
      },
    );
    const { photoUri } = response.data;
    res.json({ photoUri });
  } catch (error) {
    console.error("Photo proxy error: ", error);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
};

export const getPhotoFromLocation = async (req: Request, res: Response) => {
  const { location } = req.query;

  try {
    const findPlaceRes = await axios.post(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        textQuery: location,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.id,places.photos",
        },
      },
    );

    const place = findPlaceRes.data.places?.[0];
    const photoName = place?.photos?.[0]?.name;
    if (!photoName) {
      console.log(`No photo generated for ${location}`);
      return res.json({ photoUrl: null });
    }

    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${process.env.GOOGLE_API_KEY}`;

    res.json({ photoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
};

export const getPlaceIdFromLocation = async (req: Request, res: Response) => {
  const { location } = req.query;

  try {
    const findPlaceRes = await axios.post(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        textQuery: location,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.id,places",
        },
      },
    );

    const placeId = findPlaceRes.data.places?.[0].id;
    if (!placeId) {
      res.status(404).json({ error: "No place id found" });
    }

    res.json({ placeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch placeId" });
  }
};

export const getPlaceDetailsFromPlaceId = async (
  req: Request,
  res: Response,
) => {
  const { placeId } = req.params;
  const { formatted } = req.query;
  const fieldMask = req.header("X-Goog-FieldMask");
  const placeIdValue = Array.isArray(placeId) ? placeId[0] : placeId;
  const isFormatted =
    (Array.isArray(formatted) ? formatted[0] : formatted) === "true";

  if (!fieldMask) {
    return res
      .status(400)
      .json({ error: "X-Goog-FieldMask header is required" });
  }

  try {
    const responseData = await fetchPlaceDetails(
      placeIdValue,
      isFormatted,
      fieldMask,
    );
    res.json(responseData);
  } catch (error) {
    console.error("Place details error:", error);
    res.status(500).json({ error: "Failed to fetch place details" });
  }
};
