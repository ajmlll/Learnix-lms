import { XP, Streak } from '../models/Gamification.js';
import redisClient from '../config/redis.js';

/**
 * Award XP points to a user and invalidate leaderboard cache
 */
export const awardXP = async (userId, action, points) => {
  try {
    // 1. Record XP transaction
    await XP.create({
      user: userId,
      action,
      points,
    });

    // 2. Clear Redis leaderboard cache keys
    if (redisClient && redisClient.isOpen) {
      try {
        if (redisClient.keys) {
          const keys = await redisClient.keys('leaderboard:*');
          if (keys && keys.length > 0) {
            await Promise.all(keys.map((k) => redisClient.del(k)));
          }
        }
      } catch (redisErr) {
        console.error('[awardXP Cache Clear Error]:', redisErr.message);
      }
    }

    console.log(`[Gamification]: Awarded ${points} XP to user ${userId} for '${action}'`);
  } catch (error) {
    console.error('[awardXP Error]:', error.message);
  }
};

/**
 * Update daily learning streak for a user with streak shield support
 */
export const updateStreak = async (userId) => {
  try {
    let streak = await Streak.findOne({ user: userId });

    const now = new Date();

    if (!streak) {
      streak = await Streak.create({
        user: userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: now,
        streakShields: 1,
      });
      return streak;
    }

    const lastActive = new Date(streak.lastActiveDate);

    // Calculate day difference ignoring time
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfLastActive = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffDays = Math.round((startOfToday - startOfLastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already active today, no change
      return streak;
    } else if (diffDays === 1) {
      // Active yesterday, increment streak
      streak.currentStreak += 1;
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    } else if (diffDays > 1) {
      // Missed one or more days
      if (streak.streakShields > 0) {
        // Use a streak shield to preserve streak
        streak.streakShields -= 1;
        console.log(`[Streak Shield Used]: Shield consumed for user ${userId}. Streak preserved at ${streak.currentStreak}`);
      } else {
        // Reset streak
        streak.currentStreak = 1;
      }
    }

    streak.lastActiveDate = now;
    await streak.save();
    return streak;
  } catch (error) {
    console.error('[updateStreak Error]:', error.message);
  }
};

export default {
  awardXP,
  updateStreak,
};
