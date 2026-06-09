import mongoose from "mongoose";

export const placeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phoneNumber: {type: String},
  website: {type: String},
  openingHours: [String],
  photos: [String],
  reviews: [
    {
      authorName: String,
      rating: Number,
      text: String
    }
  ],
  types: [String],
  formattedAddress: {
    type: String, required: true
  },
  briefDescription: { type: String },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  viewport: {
    low: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    high: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  }
})

export default mongoose.model("Place", placeSchema);