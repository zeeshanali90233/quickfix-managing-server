import { CLIENT_AUTH_KEY } from "../config/env.js";

export const checkClientAuthSocket = (socket, next) => {
  const authToken = socket.handshake.query?.token ?? null;

  if (!authToken) {
    return next(new Error("Auth Token is missing"));
  }

  if (authToken === CLIENT_AUTH_KEY) {
    return next();
  }

  return next(new Error("Invalid Auth Token"));
};
