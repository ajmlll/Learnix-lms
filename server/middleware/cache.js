import redisClient from '../config/redis.js';

/**
 * Cache-aside middleware for Redis caching
 * @param {string} keyPrefix - Prefix for cache keys (e.g. 'courses_list', 'course_detail')
 * @param {number} ttlSeconds - Time-To-Live in seconds
 */
export const cacheMiddleware = (keyPrefix, ttlSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      if (redisClient && redisClient.isOpen) {
        // Attempt to fetch from Redis
        const cachedData = await redisClient.get(key);

        if (cachedData) {
          console.log(`[Cache HIT]: ${key}`);
          res.setHeader('X-Cache', 'HIT');
          const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
          return res.status(200).json(parsed);
        }
      }

      console.log(`[Cache MISS]: ${key}`);
      res.setHeader('X-Cache', 'MISS');

      // Intercept res.json to cache response payload before sending
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Only cache successful 200 OK responses
        if (res.statusCode === 200 && redisClient && redisClient.isOpen && body && body.success !== false) {
          const stringified = typeof body === 'object' ? JSON.stringify(body) : body;
          
          if (redisClient.setEx) {
            redisClient.setEx(key, ttlSeconds, stringified).catch((err) => {
              console.error(`[Cache Set Error]: ${err.message}`);
            });
          } else if (redisClient.set) {
            redisClient.set(key, stringified, { ex: ttlSeconds }).catch((err) => {
              console.error(`[Cache Set Error]: ${err.message}`);
            });
          }
        }

        return originalJson(body);
      };

      next();
    } catch (error) {
      console.warn(`[Cache Middleware Error]: ${error.message}. Bypassing cache.`);
      res.setHeader('X-Cache', 'BYPASS');
      next();
    }
  };
};

export default cacheMiddleware;
