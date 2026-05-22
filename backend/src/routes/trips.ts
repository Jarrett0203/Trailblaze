import { Router, Request, Response } from "express";
import Trip from "../models/Trip";
import { User } from "../models/User";
import axios from "axios";

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
    res.status(201).json({ message: "Trip created successfully!" });
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
      $or:[{host: user._id}, {travelers: user._id}]
    }).populate("host travelers");

    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

router.get("/place-photo", async(req: Request, res: Response) => {
  const {location} = req.query;

  try {
    const findPlaceRes = await axios.post(
      `https://places.googleapis.com/v1/places:searchText`, {
        textQuery: location,
      }, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.id,places.photos"
        }
      }
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
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch photo'});
  }
})



export default router;