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
    if (courseId) {
      await deleteKeysByPattern(`*course_detail*${courseId}*`);
    }
    await deleteKeysByPattern('courses_list:*');
    await deleteKeysByPattern('*admin_stats*');
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
    await deleteKeysByPattern('*categories*');
  } catch (error) {
    console.error('[invalidateCategoryCache Error]:', error.message);
  }
};

/**
 * Invalidate review caches for a course
 */
export const invalidateReviewCache = async (courseId) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern(`*course_reviews*${courseId}*`);
    if (courseId) {
      await invalidateCourseCache(courseId);
    }
  } catch (error) {
    console.error('[invalidateReviewCache Error]:', error.message);
  }
};

/**
 * Invalidate discussion Q&A caches for a course
 */
export const invalidateDiscussionCache = async (courseId) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern(`*course_discussions*${courseId}*`);
  } catch (error) {
    console.error('[invalidateDiscussionCache Error]:', error.message);
  }
};

/**
 * Invalidate live classes cache
 */
export const invalidateLiveClassCache = async (courseId) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern('*live_classes*');
  } catch (error) {
    console.error('[invalidateLiveClassCache Error]:', error.message);
  }
};

/**
 * Invalidate leaderboard cache
 */
export const invalidateLeaderboardCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern('*leaderboard*');
  } catch (error) {
    console.error('[invalidateLeaderboardCache Error]:', error.message);
  }
};

/**
 * Invalidate admin dashboard stats cache
 */
export const invalidateAdminStatsCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern('*admin_stats*');
    await redisClient.del('admin:dashboard_stats').catch(() => {});
  } catch (error) {
    console.error('[invalidateAdminStatsCache Error]:', error.message);
  }
};

/**
 * Invalidate instructor earnings cache
 */
export const invalidateInstructorEarningsCache = async (instructorId) => {
  if (!redisClient || !redisClient.isOpen) return;

  try {
    await deleteKeysByPattern('*instructor_earnings*');
  } catch (error) {
    console.error('[invalidateInstructorEarningsCache Error]:', error.message);
  }
};

export default {
  invalidateCourseCache,
  invalidateCategoryCache,
  invalidateReviewCache,
  invalidateDiscussionCache,
  invalidateLiveClassCache,
  invalidateLeaderboardCache,
  invalidateAdminStatsCache,
  invalidateInstructorEarningsCache,
};
