import { getMessaging } from "firebase-admin/messaging";

/**
 * Send a push notification using Firebase Admin SDK.
 *
 * @param {Object} options
 * @param {string} options.token - Single FCM device token
 * @param {string} [options.messageTitle] - Notification title
 * @param {string} [options.messageBody] - Notification body
 * @param {string} [options.imageURL] - Optional image URL for rich notification
 * @param {Object} [options.data] - Optional data payload (string key-value pairs)
 * @returns {Promise<Object>} - Result including status and error if any
 */
export const sendPushNotification = async ({
  token,
  messageTitle,
  messageBody,
  imageURL,
  data,
}) => {
  // Validate token
  if (!token || typeof token !== "string" || !token.trim()) {
    throw new Error("Push token is missing or invalid");
  }

  // Validate data
  if (
    data &&
    (typeof data !== "object" ||
      Object.values(data).some((v) => typeof v !== "string"))
  ) {
    throw new Error("Data payload must be an object with string values");
  }

  const notification = {
    title: messageTitle || "Notification",
    body: messageBody || "",
    ...(imageURL && { image: imageURL }),
  };

  const messaging = getMessaging();

  try {
    const response = await messaging.send({
      token,
      notification,
      data: data || {},
    });

    return {
      status: "Ok",
      responseId: response,
    };
  } catch (error) {
    console.error("Notification send error:", error);
    return {
      status: "Failed",
      error: error.message,
      code: error.code,
    };
  }
};
