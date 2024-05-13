import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebase/config.js";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const app = express();

app.use(cors());
app.use(limiter);

app.get("/", async (req, res) => {
  try {
    const expoPushToken =
      "eoGa97GsRtOdcty6fnx0T8:APA91bGT-L85eZYjlkbiiy7PLR9v7xO9lcq0CorC0EAi0xfZEYyh3LtKU08kCErA7wNPQsEix1o6fyjrQ5sm-RS7oS-FMvdUbCdXG108Ym9TxUFUttlNInCzLBhjgH4z79_-XRXmUmNi";

   await admin.messaging().sendToDevice(
      expoPushToken,
      {
        data: {
          title: "This is a data-type message",
          message: "`expo-notifications` events will be triggered 🤗",
          // ⚠️ Notice the schema of this payload is different
          // than that of Firebase SDK. What is there called "body"
          // here is a "message". For more info see:
          // https://docs.expo.dev/versions/latest/sdk/notifications/#android-push-notification-payload-specification

          // As per Android payload format specified above, the
          body: JSON.stringify({ photoId: 42 }), // additional "data" should be placed under "body" key.
        },
      }
      // options
    );
    console.log("Notification sent successfully");
    res.status(200).json({ status: "Ok" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});
