import { adminInstance } from "../lib/firebase.js";

// const CreateAdmin = async (req, res) => {
//   const { name, email, role, password } = req.body;

//   if (!name || !email || !role || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const userRecord = await adminInstance.auth().createUser({
//       email,
//       password,
//       displayName: name,
//       // photoURL: image || null,
//     });

//     const adminData = {
//       uid: userRecord.uid,
//       name,
//       email,
//       role,
//       // image: image || null,
//       // createdAt: adminInstance.firestore.FieldValue.serverTimestamp(),
//     };

//     await adminInstance
//       .firestore()
//       .collection("admins")
//       .doc(userRecord.uid)
//       .set(adminData);

//     res.status(201).json({
//       message: "Admin Created Successfully:",
//       admin: adminData,
//     });
//   } catch (error) {
//     console.error("Error while creating admin:", error);

//     if (error.code) {
//       res.status(500).json({
//         message: "Failed to create admin",
//         error:
//           error.message || "An error occurred while interacting with Firebase",
//       });
//     } else {
//       res.status(500).json({
//         message: "Failed to create admin",
//         error: error.message || "Unknown error",
//       });
//     }
//   }
// };

const CreateAdmin = async (req, res) => {
  // Destructure incoming request body
  const { name, email, role, password } = req.body;

  // Validate required fields
  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    console.log("Starting admin creation process...");

    // Create user in Firebase Authentication
    const userRecord = await adminInstance.auth().createUser({
      email,
      password,
      displayName: name,
    });

    console.log("Firebase Authentication user created:", userRecord);

    // Prepare admin data for Firestore
    const adminData = {
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(), // Add timestamp for record creation
    };

    // Save admin data to Firestore
    await adminInstance
      .firestore()
      .collection("admins")
      .doc(userRecord.uid)
      .set(adminData);

    console.log("Admin data saved to Firestore:", adminData);

    // Respond with success
    res.status(201).json({
      message: "Admin Created Successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error while creating admin:", error);

    // Handle Firebase Admin SDK errors
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "Email is already in use." });
    }
    if (error.code === "auth/weak-password") {
      return res.status(400).json({
        message: "Password is too weak. Please use a stronger password.",
      });
    }

    // Respond with a generic error message
    res.status(500).json({
      message: "Failed to create admin.",
      error: error.message || "An error occurred.",
    });
  }
};

const FetchAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const docRef = await adminInstance
        .firestore()
        .collection("admins")
        .doc(id)
        .get();

      return res.status(200).json({
        message: "Admin Detail is shared.",
        admin: { ...docRef.data(), firebaseId: docRef.id },
      });
    }
    const adminsSnapshot = await adminInstance
      .firestore()
      .collection("admins")
      .get();

    const admins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: "Admins fetched successfully:",
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
    return res.status(400).json({ message: "Admin ID is required:" });
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

export { CreateAdmin, FetchAdmin, DeleteAdmin };
