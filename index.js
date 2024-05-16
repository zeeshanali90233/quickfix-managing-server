import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebase/config.js";
import { rateLimit } from "express-rate-limit";
import { Expo } from "expo-server-sdk";
import { getMessaging } from "firebase-admin/messaging";

let expo = new Expo({
  accessToken: process.env.MAXCOOL_PUSH_API_TOKEN,
  useFcmV1: true,
});

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
    let messages = [];
    for (let pushToken of ["ExponentPushToken[fnb5jiFs1xOogoqSH5yeEi]"]) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken,
        sound: "default",
        body: "This is a test notification",

        title: "Test",
        data: { withSome: "data" },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();

    res.status(200).json({ status: "Ok" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});
