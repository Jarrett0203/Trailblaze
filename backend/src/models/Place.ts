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
      rating: String,
      text: String
    }
  ],
  types: [String],
  formatted_address: {
    type: String, required: true
  },
  briefDescription: { type: String },
  geometry: {
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    viewport: {
      northeast: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      },
      southwest: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    }
  }
})

export default mongoose.model("Place", placeSchema);