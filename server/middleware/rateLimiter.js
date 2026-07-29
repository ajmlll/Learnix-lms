import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js';

// Helper to create Redis store for express-rate-limit if Redis is active
const getRedisStore = (prefix) => {
  if (redisClient && redisClient.isOpen) {
    return new RedisStore({
      // @ts-ignore
      sendCommand: (...args) => {
        if (redisClient.sendCommand) {
          return redisClient.sendCommand(args);
        } else if (redisClient.call) {
          return redisClient.call(...args);
        }
      },
      prefix: `rl:${prefix}:`,
    });
  }
  return undefined; // Fallbacks to memory store if Redis unavailable
};

// Rate limiter for general auth routes (10 requests per 15 minutes)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('auth'),
  message: {
    success: false,
    message: 'Too many authentication requests from this IP. Please try again after 15 minutes.',
  },
});

// Stricter rate limiter for login route (5 attempts per 15 minutes)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('login'),
  message: {
    success: false,
    message: 'Too many failed login attempts from this IP. Account access throttled for 15 minutes.',
  },
});

export default {
  authRateLimiter,
  loginRateLimiter,
};
