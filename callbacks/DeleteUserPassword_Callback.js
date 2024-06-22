import admin from "../lib/firebase.js";

async function DeleteUserPassword_Callback(req, res) {
  const { uid, collectionName, profileImageURL } = req.body;
  if (!uid) {
    return res.status(404).json({ message: "UID is not complete" });
  } else if (!collectionName) {
    return res.status(404).json({ message: "Collection Name is not complete" });
  }

  try {
    await admin.firestore().collection(collectionName).doc(uid).delete();
    if (profileImageURL) {
      await admin.storage().bucket().file(profileImageURL).delete();
    }
    await admin.auth().deleteUser(uid);
    return res.status(200).json({
      status: "Ok",
      message: "User Details has been successfully deleted",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message || "Internal server error" });
  }
}

export default DeleteUserPassword_Callback;
