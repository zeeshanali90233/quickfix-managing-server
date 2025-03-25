import { adminInstance } from "../lib/firebase.js";
import { getDatabase } from "firebase-admin/database"; // Import Realtime Database from Firebase Admin

const CreateTechnician = async (req, res) => {
  const { name, email, password, phone, designation } = req.body;

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
      technicianDoc,
    });
  } catch (error) {
    console.error("Error creating technician:", error.message);
    return res.status(500).json({
      error: "Technician not added",
      details: error.message,
    });
  }
};

const GetAllTechnicians = async (req, res) => {
  try {
    const db = getDatabase(adminInstance);
    const usersRef = db.ref("users");

    const usersData = (await usersRef.get()).val();

    if (!usersData) {
      return res.status(404).json({ message: "No technicians found" });
    }

    const technicians = Object.keys(usersData)
      .map((id) => ({
        id,
        ...usersData[id].userData,
      }))
      .filter((user) => user.role === 1);

    if (technicians.length === 0) {
      return res
        .status(404)
        .json({ message: "No technicians found with role 1" });
    }

    return res.status(200).json({
      message: "Technicians retrieved successfully",
      technicians,
    });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return res.status(500).json({
      message: "Failed to get technicians",
      error,
    });
  }
};

const GetTechnicianByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Technician ID is required." });
    }

    const db = getDatabase(adminInstance);
    const technicianRef = db.ref(`users/${id}/userData`);
    const technicianData = (await technicianRef.get()).val();

    if (!technicianData) {
      return res
        .status(404)
        .json({ message: `No technician found with ID: ${id}` });
    }

    return res.status(200).json({
      message: "Technician details.",
      technician: { id, ...technicianData },
    });
  } catch (error) {
    console.error("Error fetching technician:", error);
    return res.status(500).json({
      message: "An error occurred while fetching technician details.",
      error,
    });
  }
};

const UpdateTechnician = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Technician ID is required" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const db = getDatabase(adminInstance);
    const technicianRef = db.ref(`users/${id}/userData`);

    const technicianData = (await technicianRef.get()).val();
    if (!technicianData) {
      return res.status(404).json({ message: "Technician not found" });
    }

    await technicianRef.update(updates);

    if (updates.email || updates.name) {
      await adminInstance.auth().updateUser(id, {
        email: updates.email || technicianData.email,
        displayName: updates.name || technicianData.name,
      });
    }

    return res.status(200).json({
      message: "Technician updated successfully",
      updatedTechnician: { id, ...technicianData, ...updates },
    });
  } catch (error) {
    console.error("Error updating technician:", error);
    return res.status(500).json({
      message: "Failed to update technician",
      error: error.message,
    });
  }
};

const DeleteTechnician = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Technician ID is required" });
  }

  try {
    const db = getDatabase(adminInstance);

    await db.ref(`users/${id}`).remove();

    await adminInstance.auth().deleteUser(id);

    return res.status(200).json({ message: "Technician deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete technician",
      error: error.message,
    });
  }
};

export {
  CreateTechnician,
  GetAllTechnicians,
  GetTechnicianByID,
  DeleteTechnician,
  UpdateTechnician,
};
