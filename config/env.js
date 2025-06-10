import { config } from "dotenv";

const PATH = ".env";

config({ path: PATH });

export const {
  GOOGLE_APPLICATION_CREDENTIALS,
  MONGODB_URI,
  PROJECTID,
  LOCATION,
  AGENTID,
  REDIS_PASSWORD,
  REDIS_HOST,
  QUICKFIX_PUSH_API_TOKEN,
  GEMINI_KEY,
  CLIENT_AUTH_KEY,
  DEFAULT_PASSWORD,
  PORT,
} = process.env;

export const AGENT_NAME = "Service Agent";
