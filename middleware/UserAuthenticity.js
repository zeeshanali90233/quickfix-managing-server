function CheckUserAuthenticity(req, res, next) {
  const { authToken } = req.body;

  if (!authToken) {
    return res
      .status(400)
      .json({ status: "Error", message: "Auth Token is missing" });
  }

  if (authToken === process.env.CLIENT_AUTH_KEY) {
    return next();
  }

  return res
    .status(401)
    .json({ status: "Error", message: "Invalid Auth Token" });
}

export default CheckUserAuthenticity;
