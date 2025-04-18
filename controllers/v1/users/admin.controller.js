import { adminInstance } from "../../../firebase/admin.js";

export const CreateAdmin = async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const adminRecord = await adminInstance.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const adminData = {
      uid: adminRecord.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    await adminInstance
      .firestore()
      .collection("admins")
      .doc(adminRecord.uid)
      .set(adminData);

    res.status(201).json({
      message: "Admin Created Successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error while creating admin:", error);

    res.status(500).json({
      message: "Failed to create admin.",
      error,
    });
  }
};

export const GetAllAdmins = async (req, res) => {
  try {
    const adminsRef = adminInstance.firestore().collection("admins");
    const snapshot = await adminsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No admins found." });
    }

    const admins = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      message: "Admins fetched successfully.",
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({
      message: "Failed to fetch admins.",
      error,
    });
  }
};

export const UpdateAdmin = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required." });
  }

  try {
    const adminRef = adminInstance.firestore().collection("admins").doc(id);

    await adminRef.update(updateData);

    return res.status(200).json({
      message: "Admin updated successfully.",
      updatedFields: updateData,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({
      message: "Failed to update admin.",
      error: error.message,
    });
  }
};

export const DeleteAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required:" });
  }

  try {
    const adminRef = adminInstance.firestore().collection("admins").doc(id);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({ message: "Admin not found." });
    }

    await adminInstance.auth().deleteUser(id);

    await adminRef.delete();

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);
  }
};
