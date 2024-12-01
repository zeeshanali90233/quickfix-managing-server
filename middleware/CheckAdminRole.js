import { adminInstance } from "../lib/firebase.js";

const CheckAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }

    const decodedToken = await adminInstance.auth().verifyIdToken(token);
    if (decodedToken.admin) {
      next(); // User is an admin, proceed to the next middleware
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to verify admin privileges." });
  }
};

export default CheckAdminRole;
