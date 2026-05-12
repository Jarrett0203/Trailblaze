import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const mongoUri = `mongodb+srv://${username}:${password}@cluster0.1af3h3b.mongodb.net/`;
mongoose.connect(mongoUri).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.log("MongoDB connection error", err);
  process.exit(1);
})

app.listen(port, () => {
  console.log("server running on port 3000");
})