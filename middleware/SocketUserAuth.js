function CheckSocketClientAuth(socket, next) {
  const authToken = socket.handshake.query?.token ?? null;

  if (!authToken) {
    return next(new Error("Auth Token is missing"));
  }

  if (authToken === process.env.CLIENT_AUTH_KEY) {
    return next();
  }

  return next(new Error("Invalid Auth Token"));
}

export default CheckSocketClientAuth;
