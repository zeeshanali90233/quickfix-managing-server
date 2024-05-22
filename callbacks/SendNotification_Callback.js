import { Expo } from "expo-server-sdk";
import expoInstance from "../lib/expo_server.js";

async function SendNotification_CallBack(req, res) {
  const { token, messageBody, messageTitle } = req.body;
  if (!token) {
    return res.status(404).json({ message: "Receive Push Token Missing" });
  }
  try {
    let messages = [];
    for (let pushToken of Array.isArray(token) ? token : [token]) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default",
        body: messageBody,
        title: messageTitle,
        icon: "https://maxcool-server-production.up.railway.app/",
      });
    }

    let chunks = expoInstance.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expoInstance.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        // console.error(error);
      }
    }
    return res.status(200).json({ status: "Ok", ticketChunk: tickets });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default SendNotification_CallBack;
