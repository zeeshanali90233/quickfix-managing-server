// Middleware to verify Bearer token
export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No Bearer token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.CLIENT_AUTH_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid Bearer token" });
  }

  next(); // Proceed if token is valid
};
