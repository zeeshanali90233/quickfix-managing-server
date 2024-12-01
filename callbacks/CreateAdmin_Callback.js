import { adminInstance } from "../lib/firebase.js";

const CreateAdmin = async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userRecord = await adminInstance.auth().createUser({
      email,
      password,
      displayName: name,
      // photoURL: image || null,
    });

    const adminData = {
      uid: userRecord.uid,
      name,
      email,
      role,
      // image: image || null,
      // createdAt: adminInstance.firestore.FieldValue.serverTimestamp(),
    };

    await adminInstance
      .firestore()
      .collection("admins")
      .doc(userRecord.uid)
      .set(adminData);

    res.status(201).json({
      message: "Admin Created Successfully :)",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error while creating admin:", error);

    if (error.code) {
      res.status(500).json({
        message: "Failed to create admin",
        error:
          error.message || "An error occurred while interacting with Firebase",
      });
    } else {
      res.status(500).json({
        message: "Failed to create admin",
        error: error.message || "Unknown error",
      });
    }
  }
};

const FetchAllAdmins = async (req, res) => {
  try {
    const adminsSnapshot = await adminInstance
      .firestore()
      .collection("admins")
      .get();

    const admins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: "Admins fetched successfully",
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      message: "Failed to fetch admins",
      error: error.message || "An unknown error occurred",
    });
  }
};

const DeleteAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required." });
  }

  try {
    await adminInstance.auth().deleteUser(id);

    await adminInstance.firestore().collection("admins").doc(id).delete();

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);

    if (error.code) {
      res.status(500).json({
        message: "Failed to delete admin",
        error:
          error.message || "An error occurred while interacting with Firebase",
      });
    } else {
      res.status(500).json({
        message: "Failed to delete admin",
        error: error.message || "An unknown error occurred",
      });
    }
  }
};

export { CreateAdmin, FetchAllAdmins, DeleteAdmin };
