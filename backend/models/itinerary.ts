import mongoose from "mongoose";
import { placeSchema } from "./place";

export const itinerarySchema = new mongoose.Schema({
  date: {type: String, required: true},
  activities: [placeSchema]
})

export default mongoose.model("Itinerary", itinerarySchema)