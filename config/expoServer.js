import { Expo } from "expo-server-sdk";
import { QUICKFIX_PUSH_API_TOKEN } from "../config/env.js";

export const expoInstance = new Expo({
  accessToken: QUICKFIX_PUSH_API_TOKEN,
  useFcmV1: true,
});
