import redisClient from '../config/redis.js';

/**
 * Delete keys matching a wildcard pattern safely
 */
const deleteKeysByPattern = async (pattern) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    if (redisClient.keys) {
      const keys = await redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((k) => redisClient.del(k)));
        console.log(`[Cache Invalidation]: Cleared ${keys.length} keys matching pattern '${pattern}'`);
      }
    }
  } catch (error) {
    console.error(`[Cache Invalidation Error for pattern '${pattern}']:`, error.message);
  }
};

/**
 * Invalidate specific course detail and all course listing caches
 */
export const invalidateCourseCache = async (courseId) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    // 1. Delete specific course detail key
    if (courseId) {
      const detailPattern = `course_detail:/api/courses/${courseId}*`;
      await deleteKeysByPattern(detailPattern);
    }

    // 2. Delete all course list caches
    await deleteKeysByPattern('courses_list:*');
  } catch (error) {
    console.error('[invalidateCourseCache Error]:', error.message);
  }
};

/**
 * Invalidate all category caches
 */
export const invalidateCategoryCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern('categories:*');
  } catch (error) {
    console.error('[invalidateCategoryCache Error]:', error.message);
  }
};

export default {
  invalidateCourseCache,
  invalidateCategoryCache,
};
