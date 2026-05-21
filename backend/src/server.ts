import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Trip from "./models/Trip";
import { User } from "./models/User";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const mongoUri = `mongodb+srv://${username}:${password}@cluster0.1af3h3b.mongodb.net/`;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log("server running on port 3000");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Trailblaze API");
});

app.post("/api/trips", async (req: Request, res: Response) => {
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

app.get("/api/trips", async (req: Request, res: Response) => {
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
