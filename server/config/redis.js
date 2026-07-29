import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl && redisUrl.startsWith('http') ? undefined : redisUrl,
});

redisClient.on('connect', () => {
  console.log('[Redis] Client connecting...');
});

redisClient.on('ready', () => {
  console.log('[Redis] Connection established and ready');
});

redisClient.on('reconnecting', () => {
  console.warn('[Redis] Reconnecting to server...');
});

redisClient.on('error', (err) => {
  console.error(`[Redis Error]: ${err.message}`);
});

export const connectRedis = async () => {
  if (!process.env.REDIS_URL || process.env.REDIS_URL.startsWith('http')) {
    console.warn('[Redis] REDIS_URL is invalid for standard TCP Redis client (e.g. HTTP Upstash endpoint provided). Skipping Redis TCP connect.');
    return;
  }
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(`[Redis Initial Connect Error]: ${error.message}`);
  }
};

export default redisClient;
