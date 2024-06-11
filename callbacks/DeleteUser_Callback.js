import admin from "../lib/firebase.js";

async function DeleteUser_Callback(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(404).json({ message: "User Id is missing" });
  }
  try {
    await admin
      .auth()
      .updateUser(userId, { password: process.env.DEFAULT_PASSWORD });
    return res.status(200).json({
      status: "Ok",
      message: `Password Reseted to default ` + process.env.DEFAULT_PASSWORD,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default DeleteUser_Callback;
