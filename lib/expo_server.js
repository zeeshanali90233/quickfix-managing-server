import { Expo } from "expo-server-sdk";

let expoInstance = new Expo({
  accessToken: process.env.MAXCOOL_PUSH_API_TOKEN,
  useFcmV1: true,
});

export const initializeExpo = (req, res, next) => {
  next();
};

export default expoInstance;
