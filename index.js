import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import V1_Main from "./controllers/V1/Main.js";
import { initializeExpo } from "./lib/expo_server.js";

dotenv.config();

// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   limit: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes).
//   standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// });

const app = express();

app.use(initializeExpo);
app.use(cors());
// app.use(limiter);
app.use(express.json());

// V1
app.use("/v1", V1_Main);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to Maxcool Sever" });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});
