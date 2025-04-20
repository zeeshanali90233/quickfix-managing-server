import { getMessaging } from "firebase-admin/messaging";
import { adminInstance } from "../../../firebase/admin.js";

export const sendNotification = async (req, res) => {
  const { token, messageBody, messageTitle, imageURL, data } = req.body;

  if (!token || !Array.isArray(token) || token.length === 0) {
    return res
      .status(404)
      .json({ message: "Receive Push Token Missing or Invalid" });
  }

  const message = {
    notification: {
      title: messageTitle || "Notification",
      body: messageBody || "",
      image: imageURL || undefined,
    },
    data: data || {},
    tokens: token,
  };

  try {
    const response = await getMessaging(adminInstance).sendMulticast({
      tokens: message.tokens,
      notification: message.notification,
      data: message.data,
    });

    return res.status(200).json({
      status: "Ok",
      errors: response.responses
        .filter((r) => !r.success)
        .map((r) => r.error?.message || "Unknown error"),
    });
  } catch (error) {
    console.error("FCM Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
