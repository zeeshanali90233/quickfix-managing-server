import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebase/config.js";

dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ status: "Ok" });
});
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});
