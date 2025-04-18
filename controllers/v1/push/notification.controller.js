import { Expo } from "expo-server-sdk";
import { getMessaging } from "firebase-admin/messaging";
import { adminInstance } from "../../../firebase/admin.js";

export const sendNotification = async (req, res) => {
  const { token, messageBody, messageTitle, imageURL, data } = req.body;
  if (!token) {
    return res.status(404).json({ message: "Receive Push Token Missing" });
  }
  try {
    return res.status(200).json({ status: "Ok" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
