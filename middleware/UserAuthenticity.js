function CheckUserAuthenticity(req, res, next) {
  const { userToken } = req.body;

  if (!userToken) {
    return res
      .status(400)
      .json({ status: "Error", message: "User Token is missing" });
  }

  if (userToken === process.env.CLIENT_AUTH_KEY) {
    return next();
  }

  return res
    .status(401)
    .json({ status: "Error", message: "Invalid User Token" });
}

export default CheckUserAuthenticity;
