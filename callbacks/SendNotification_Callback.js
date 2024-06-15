import { Expo } from "expo-server-sdk";
import expoInstance from "../lib/expo_server.js";
import admin from "../lib/firebase.js";
import { getMessaging } from "firebase-admin/messaging";

async function SendNotification_CallBack(req, res) {
  const { token, messageBody, messageTitle, imageURL } = req.body;
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
        sound: {
          critical: true,
          name: "default",
          volume: 1,
        },
        channelId: "priority",
        body: messageBody,
        title: messageTitle,
        icon:
          imageURL ??
          "https://maxcool-server-production.up.railway.app/public/companyLogo.png",
        priority: "high",
        ttl: 5000,
      });
    }

    let chunks = expoInstance.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expoInstance.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    // const messageConfig = {
    //   token: token,
    //   notification: {
    //     title: messageTitle,
    //     body: messageBody,
    //   },

    //   apns: {
    //     payload: {
    //       aps: {
    //         alert: {
    //           title: messageTitle,
    //           body: messageBody,
    //         },
    //         badge: 1,
    //         sound: "CriticalSound",
    //       },
    //     },
    //   },
    // };

    // if (imageURL) {
    //   messageConfig.notification.imageUrl = imageURL;
    // }

    // const firebaseTicket = await getMessaging().send(messageConfig);

    // return res.status(200).json({ status: "Ok", ticketChunk: firebaseTicket });
    return res.status(200).json({ status: "Ok", ticketChunk: tickets });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default SendNotification_CallBack;
