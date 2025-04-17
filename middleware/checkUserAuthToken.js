import { CLIENT_AUTH_KEY } from "../config/env.js";

export const checkUserAuthToken = (req, res, next) => {
  const { authToken } = req.body;

  if (!authToken) {
    return res
      .status(400)
      .json({ status: "Error", message: "Auth Token is missing" });
  }

  if (authToken === CLIENT_AUTH_KEY) {
    return next();
  }

  return res
    .status(401)
    .json({ status: "Error", message: "Invalid Auth Token" });
};
