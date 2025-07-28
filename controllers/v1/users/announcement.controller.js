import { adminInstance } from "../../../firebase/admin.js";
import { getMessaging } from "firebase-admin/messaging";

// Create a new client announcement
const CreateClientAnnouncement = async (req, res) => {
  const { title, message } = req.body;

  try {
    // Prepare announcement data
    const announcementData = {
      title,
      message,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore in "announcements" collection
    const announcementRef = await adminInstance
      .firestore()
      .collection("announcements")
      .add(announcementData);

    // Send push notification to all user FCM tokens individually
    const messaging = getMessaging();
    let notificationSent = false;
    let sendErrors = [];
    try {
      // Fetch all users from Realtime Database
      const usersSnapshot = await adminInstance
        .database()
        .ref("/users")
        .once("value");
      const usersData = usersSnapshot.val() || {};
      const tokens = [];
      Object.values(usersData).forEach((user) => {
        if (user && user.fcmToken) {
          if (Array.isArray(user.fcmToken)) {
            user.fcmToken.forEach((token) => {
              if (typeof token === "string" && token.trim().length > 0)
                tokens.push(token);
            });
          } else if (
            typeof user.fcmToken === "string" &&
            user.fcmToken.trim().length > 0
          ) {
            tokens.push(user.fcmToken);
          }
        }
      });
      if (tokens.length === 0) {
      } else {
        // Send notification to each token individually
        const notification = {
          title: title,
          body: message,
        };
        const sendResults = await Promise.allSettled(
          tokens.map((token) =>
            messaging.send({
              token,
              notification,
              data: {
                type: "announcement",
                announcementId: announcementRef.id,
              },
            })
          )
        );
        sendErrors = sendResults
          .map((result, idx) =>
            result.status === "rejected"
              ? {
                  token: tokens[idx],
                  error: result.reason?.message,
                  code: result.reason?.code,
                }
              : null
          )
          .filter(Boolean);
        notificationSent = sendErrors.length < tokens.length;
      }
    } catch (sendError) {}

    // Respond with success (or partial success if some sends failed)
    res.status(201).json({
      message: "Client Announcement Created Successfully",
      announcement: { id: announcementRef.id, ...announcementData },
      notificationSent,
      sendErrors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create announcement",
      error: error.message || "An unknown error occurred",
    });
  }
};

// Fetch all client announcements
const FetchClientAnnouncements = async (req, res) => {
  try {
    const announcementsSnapshot = await adminInstance
      .firestore()
      .collection("announcements")
      .get();

    const announcements = announcementsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: "Client Announcements fetched successfully",
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      message: "Failed to fetch announcements",
      error: error.message || "An unknown error occurred",
    });
  }
};

// Delete a client announcement
const DeleteClientAnnouncement = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Announcement ID is required." });
  }

  try {
    await adminInstance
      .firestore()
      .collection("announcements")
      .doc(id)
      .delete();

    res
      .status(200)
      .json({ message: "Client Announcement deleted successfully." });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      message: "Failed to delete announcement",
      error: error.message || "An unknown error occurred",
    });
  }
};
export {
  CreateClientAnnouncement,
  FetchClientAnnouncements,
  DeleteClientAnnouncement,
};
