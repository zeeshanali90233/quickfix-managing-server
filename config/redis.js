import { createClient } from "redis";
import { REDIS_PASSWORD, REDIS_HOST } from "./env.js";

const redisConfig = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: 11513,
  },
});

async function getRedisClient(successCB = () => {}, errorCB = () => {}) {
  try {
    if (redisConfig.isOpen) {
      successCB("Redis client is already connected");
      return redisConfig;
    }

    await redisConfig.connect();
    await redisConfig.ping();
    console.log("Redis Connected");
    successCB("Redis Connected successfully");
    return redisConfig;
  } catch (err) {
    errorCB(`Error connecting to Redis: ${err.message}`);
  }
}

const redisClient = await getRedisClient(
  (message) => {
    console.log("Success:", message);
  },
  (message) => {
    console.error("Error:", message);
  }
);

export const getResponseFromRedis = async (
  key,
  successCB = () => {},
  errorCB = () => {}
) => {
  try {
    const existingData = await redisClient.get(key);
    if (existingData) {
      successCB("Data retrieved successfully");
      return JSON.parse(existingData);
    } else {
      successCB("No data found for the given key");
      return [];
    }
  } catch (err) {
    errorCB(`Error retrieving data: ${err.message}`);
    return [];
  }
};

export const removeResponseFromRedis = async (
  key,
  successCB = () => {},
  errorCB = () => {}
) => {
  try {
    const res = await redisClient.del(key);
    successCB("Data removed successfully");
    return res;
  } catch (err) {
    errorCB(`Error removing data: ${err.message}`);
  }
};

export const addResponseToRedis = async (
  sessionPhoneNo,
  newResponse,
  successCB = () => {},
  errorCB = () => {}
) => {
  try {
    const oneDayExpiration = 7 * 60 * 60;
    const conversation = await getResponseFromRedis(sessionPhoneNo);

    conversation.push({ ai: newResponse.ai, human: newResponse?.human });

    await redisClient.set(sessionPhoneNo, JSON.stringify(conversation), {
      EX: oneDayExpiration,
    });

    successCB("Data added successfully");
  } catch (err) {
    errorCB(`Error adding data: ${err.message}`);
  }
};
