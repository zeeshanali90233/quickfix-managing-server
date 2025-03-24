import { adminInstance } from "../lib/firebase.js";
import { getDatabase } from "firebase-admin/database"; // Import Realtime Database from Firebase Admin



const CreateTechnician = async (req, res) => {
  const { name, email, password, phone, designation } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone || !designation) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create user in Firebase Authentication
    const technicianDoc = await adminInstance.auth().createUser({
      email,
      password,
      displayName: name,
      //phoneNumber: phone, // Ensure phone format is +1234567890
    });
    const db = getDatabase(); // Get Database Instance
    const { uid } = technicianDoc; // Replace this with the actual user ID

    db.ref(`users/${uid}/userData`)
      .set({
        name,
        email,
        phone,
        designation,
        role: 1,
      })
      .then(() => {
        console.log("Added in Realtime Database");
      })
      .catch((error) => {
        console.error("Error adding to Realtime Database:", error);
      });


    return res.status(201).json({
      message: "Technician added successfully",
      technicianId: technicianDoc.uid,
      technicianDoc
    });

  } catch (error) {
    console.error("Error creating technician:", error.message);
    return res.status(500).json({
      error: "Technician not added",
      details: error.message,
    });
  }
};



const GetTechnicians = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const docRef = await adminInstance
        .firestore()
        .collection("technicians")
        .doc(id)
        .get();

      return res.status(200).json({
        message: "Technician Detail is shared.",
        technician: { ...docRef.data(), firebaseId: docRef.id },
      });
    }
    const snapshot = await adminInstance
      .firestore()
      .collection("technicians")
      .get();

    const technicians = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res
      .status(200)
      .json({ message: "Technicians fetched successfully:", technicians });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch technicians", error });
  }
};

const DeleteTechnician = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Technician ID is required:" });
  }

  try {
    await adminInstance.firestore().collection("technicians").doc(id).delete();

    res.status(200).json({ message: "Technician deleted successfully:" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete technician", error });
  }
};

export { CreateTechnician, GetTechnicians, DeleteTechnician };
