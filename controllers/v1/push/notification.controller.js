import { getMessaging } from "firebase-admin/messaging";

export const sendNotifications = async (req, res) => {
  const { tokens, messageBody, messageTitle, imageURL, data } = req.body;

  // Validate inputs
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res
      .status(400)
      .json({ message: "Push tokens are missing or invalid" });
  }
  if (
    !tokens.every(
      (token) => typeof token === "string" && token.trim().length > 0
    )
  ) {
    return res
      .status(400)
      .json({ message: "One or more push tokens are invalid" });
  }
  if (
    data &&
    (typeof data !== "object" ||
      Object.values(data).some((v) => typeof v !== "string"))
  ) {
    return res
      .status(400)
      .json({ message: "Data payload must be an object with string values" });
  }

  const notification = {
    title: messageTitle || "Notification",
    body: messageBody || "",
    ...(imageURL && { image: imageURL }),
  };

  const messaging = getMessaging();

  // Batch tokens to avoid overwhelming the server
  const batchSize = 500;
  const batches = [];
  for (let i = 0; i < tokens.length; i += batchSize) {
    batches.push(tokens.slice(i, i + batchSize));
  }

  const results = [];
  try {
    // Send notifications to each token individually
    const results = await Promise.allSettled(
      tokens.map((token) =>
        messaging.send({
          token,
          notification,
          data: data || {},
        })
      )
    );

    const errors = results
      .map((result, index) =>
        result.status === "rejected"
          ? {
              token: tokens[index],
              error: result.reason.message,
              code: result.reason.code,
            }
          : null
      )
      .filter(Boolean);

    const successCount = tokens.length - errors.length;
    const status =
      errors.length === tokens.length ? 400 : errors.length > 0 ? 207 : 200;
    return res.status(status).json({
      status:
        status === 200 ? "Ok" : status === 207 ? "Partial Success" : "Failed",
      successCount,
      failureCount: errors.length,
      errors,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
