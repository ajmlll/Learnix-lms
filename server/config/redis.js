import { createClient } from 'redis';
import { Redis as UpstashRedis } from '@upstash/redis';

let redisClient = { isOpen: false };
let isUpstash = false;

const redisUrl = process.env.REDIS_URL;

if (redisUrl && redisUrl.startsWith('http')) {
  isUpstash = true;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;
  if (token) {
    redisClient = new UpstashRedis({
      url: redisUrl,
      token: token,
    });
    console.log('[Redis] Initialized Upstash HTTP REST client');
  } else {
    console.warn('[Redis] Upstash HTTPS URL detected but UPSTASH_REDIS_REST_TOKEN is missing in .env. Skipping Redis connection.');
  }
} else if (redisUrl && redisUrl.startsWith('redis')) {
  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.warn('[Redis] Max reconnection attempts reached. Continuing without Redis.');
          return new Error('Redis reconnection limit reached');
        }
        return Math.min(retries * 500, 2000);
      },
    },
  });

  redisClient.on('connect', () => console.log('[Redis] Client connecting...'));
  redisClient.on('ready', () => console.log('[Redis] Connection established and ready'));
  redisClient.on('error', (err) => console.error(`[Redis Error]: ${err.message}`));
} else {
  console.warn('[Redis] No valid REDIS_URL provided. Skipping Redis client initialization.');
}

export const connectRedis = async () => {
  if (isUpstash && redisClient.ping) {
    try {
      await redisClient.ping();
      redisClient.isOpen = true;
      console.log('[Redis] Upstash REST ping successful');
    } catch (err) {
      console.warn(`[Redis Upstash Ping Warning]: ${err.message}`);
      redisClient.isOpen = false;
    }
  } else if (redisClient.connect) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error(`[Redis Connect Error]: ${error.message}`);
    }
  }
};

export default redisClient;
