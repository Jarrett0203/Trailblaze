import mongoose from "mongoose";
import { expenseSchema } from "./expense";
import { placeSchema } from "./place";
import { itinerarySchema } from "./itinerary";

const tripSchema = new mongoose.Schema({
  tripName: {
    type:String,
    required:true
  },
  startDate: {
    type:String,
    required:true
  },
  endDate: {
    type:String,
    required:true
  },
  startDay: {
    type:String,
    required:true
  },
  endDay: {
    type:String,
    required:true
  },
  background: {
    type:String,
    required:true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  travelers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  budget: {
    type: Number,
    default: 0
  },
  expense: [expenseSchema],
  placesToVisit: [placeSchema],
  itinerary: [itinerarySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Trip", tripSchema);