import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 11513,
  },
});

async function getRedisClient() {
  try {
    if (redisConfig.isOpen) {
      return redisConfig;
    }

    await redisConfig.connect();
    await redisConfig.ping();
    console.log("Redis Connected");
    return redisConfig;
  } catch (err) {
    // console.log(err);
  }
}

const redisClient = await getRedisClient();

export const getResponseFromRedis = async (key) => {
  const existingData = await redisClient.get(key);
  return existingData ? JSON.parse(existingData) : [];
};

export const removeResponseFromRedis = async (key) => {
  const res = await redisClient.del(key);
  return res;
};

export const addResponseToRedis = async (sessionPhoneNo, newResponse) => {
  try {
    const oneDayExpiration = 7 * 60 * 60;
    const conversation = await getResponseFromRedis(sessionPhoneNo);

    conversation.push({ ai: newResponse.ai, human: newResponse?.human });

    await redisClient.set(sessionPhoneNo, JSON.stringify(conversation), {
      EX: oneDayExpiration,
    });
    return;
  } catch (err) {
    // console.log(err);
  }
};

export default getRedisClient;
