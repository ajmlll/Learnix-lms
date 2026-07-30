import { Streak } from '../models/Gamification.js';

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

    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (!streak.activeDates) streak.activeDates = [];
    if (!streak.activeDates.includes(todayStr)) {
      streak.activeDates.push(todayStr);
    }

    streak.lastActiveDate = now;
    await streak.save();
    return streak;
  } catch (error) {
    console.error('[updateStreak Error]:', error.message);
  }
};

export default {
  updateStreak,
};
