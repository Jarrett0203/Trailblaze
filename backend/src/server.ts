import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes";
import { connectDB } from "./db";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });
