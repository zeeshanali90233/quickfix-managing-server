import { adminInstance } from "../lib/firebase.js";

const CreateTechnician = async (req, res) => {
  const { name, email, phone, designation, image } = req.body;

  if (!name || !email || !phone || !designation) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const technicianData = {
      name,
      email,
      phone,
      designation,
      image: image || null,
      createdAt: adminInstance.firestore.FieldValue.serverTimestamp(),
    };

    const technicianDoc = await adminInstance
      .firestore()
      .collection("technicians")
      .add(technicianData);

    res.status(201).json({
      message: "Technician added successfully",
      technicianId: technicianDoc.id,
      technician: technicianData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add technician", error });
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
      .json({ message: "Technicians fetched successfully", technicians });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch technicians", error });
  }
};

const DeleteTechnician = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Technician ID is required." });
  }

  try {
    await adminInstance.firestore().collection("technicians").doc(id).delete();

    res.status(200).json({ message: "Technician deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete technician", error });
  }
};

export { CreateTechnician, GetTechnicians, DeleteTechnician };
