import { CLIENT_AUTH_KEY } from "../config/env.js";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No Bearer token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== CLIENT_AUTH_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid Bearer token" });
  }

  next();
};
