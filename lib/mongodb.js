import mongoose from "mongoose";

export function ConnectMongoDB() {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB Database Connected");
  } catch (err) {
    console.log("Something went wrong , while connecting db");
  }
}
