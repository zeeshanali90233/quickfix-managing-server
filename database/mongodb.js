import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";

export const connectToDatabase = async (successCB, errorCB) => {
  try {
    await mongoose.connect(MONGODB_URI);
    successCB("Connected to MongoDB database");
  } catch (error) {
    errorCB("Error connecting to MongoDB database: ", error);
    process.exit(1);
  }
};
