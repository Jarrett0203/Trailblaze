import mongoose from "mongoose";

export const connectDB = async () => {
  const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
  const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.1af3h3b.mongodb.net/`;
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};