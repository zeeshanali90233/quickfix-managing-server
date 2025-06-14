import { adminInstance } from "../../../firebase/admin.js";

// Create a new client announcement
const CreateClientAnnouncement = async (req, res) => {
  const { title, message } = req.body;

  // Validate required fields
  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required." });
  }

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

    // Respond with success
    res.status(201).json({
      message: "Client Announcement Created Successfully",
      announcement: { id: announcementRef.id, ...announcementData },
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
