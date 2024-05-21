import admin from "../lib/firebase.js";

async function ResetUserPassword_Callback(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(404).json({ message: "Email is missing" });
  }
  try {
    const response = await admin.auth().generatePasswordResetLink(email);
    return res.status(200).json({
      status: "Ok",
      message: `Reset Link for ${email} has been shared`,
      resetLink: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default ResetUserPassword_Callback;
