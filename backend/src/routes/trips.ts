import { Photo } from "./../types/Photo";
import { Router, Request, Response } from "express";
import Trip from "../models/Trip";
import { User } from "../models/User";
import axios from "axios";
import { Review } from "../types/Review";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      budget = 0,
      expenses = [],
      placesToVisit = [],
      itinerary = [],
      travelers = [],
      clerkUserId,
      userData = {},
    } = req.body;

    if (!clerkUserId) {
      return res.status(401).json({ error: "User id is required" });
    }
    if (
      !tripName ||
      !startDate ||
      !endDate ||
      !startDay ||
      !endDay ||
      !background
    ) {
      return res.status(400).json({ error: "Missing required trip fields" });
    }
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      const { email, name } = userData;
      if (!email) {
        return res.status(400).json({ error: "User email is required" });
      }
      user = new User({ clerkUserId, email, name });
      await user.save();
    }

    const trip = new Trip({
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      host: user._id,
      travelers: [user._id, ...travelers],
      budget,
      expenses,
      placesToVisit,
      itinerary,
    });

    await trip.save();
    res.status(201).json({ message: "Trip created successfully!", trip });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.query.clerkUserId?.toString();
    const email = req.query.email?.toString();

    if (!clerkUserId) {
      return res.status(401).json({ error: "User id is required" });
    }

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      if (!email) {
        return res.status(400).json({ error: "User email is required" });
      }
      user = new User({ clerkUserId, email, name: "" });
      await user.save();
    }

    const trips = await Trip.find({
      $or: [{ host: user._id }, { travelers: user._id }],
    }).populate("host travelers");

    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

router.get("/place-photo", async (req: Request, res: Response) => {
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
});

router.get("/:tripId", async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const clerkUserId = req.query.clerkUserId?.toString();

  if (!clerkUserId) {
    return res.status(401).json({ error: "User id is required!" });
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ error: "User not found!"});
    }

    const trip = await Trip.findById(tripId).populate("host travelers");
    if (!trip) {
      return res.status(404).json({ error: "Trip not found!"});
    }

    res.status(200).json({trip});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

router.post("/:tripId/places", async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const { placeId } = req.body;
  if (!placeId) {
    return res.status(400).json({ error: "Place id is required!" });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: "Trip is not found!" });
  }

  try {
    const placeDetailsRes = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "id,displayName,internationalPhoneNumber,websiteUri,currentOpeningHours,photos,reviews,types,formattedAddress,editorialSummary,addressComponents,location,viewport",
        },
      },
    );

    const details = placeDetailsRes.data;

    if (!details) {
      return res.status(400).json({ error: "Failed to fetch place details!" });
    }

    const placeData = {
      name: details.displayName?.text || "Undefined place",
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
        details.editorialSummary?.text.slice(0, 200) + "..." ||
        details.reviews?.[0].text.slice(0, 200) + "..." ||
        `Located in ${details.addressComponents?.[2]?.longText || details.formattedAddress || "this area"}. A nice place to visit.`,
      location: details.location || { latitude: 0, longitude: 0 },
      viewport: details.viewport || {
        low: { latitude: 0, longitude: 0 },
        high: { latitude: 0, longitude: 0 },
      },
    };

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { placesToVisit: placeData } },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Place added successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Add Place Error:", error);
    res.status(500).json({ error: "Failed to add place to trip!" });
  }
});

export default router;
