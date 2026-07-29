import { XP, Streak, WeeklyGoal, Badge, UserBadge } from '../models/Gamification.js';
import User from '../models/User.js';
import redisClient from '../config/redis.js';

// @desc    Get current user XP & Level
// @route   GET /api/gamification/xp
// @access  Private
export const getXP = async (req, res, next) => {
  try {
    const xpRecords = await XP.find({ user: req.user._id }).lean();
    const totalXP = xpRecords.reduce((acc, curr) => acc + (curr.points || 0), 0);
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;

    res.status(200).json({
      success: true,
      totalXP,
      level,
      history: xpRecords.slice(-10).reverse(), // Last 10 XP activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user streak
// @route   GET /api/gamification/streak
// @access  Private
export const getStreak = async (req, res, next) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id }).lean();

    if (!streak) {
      streak = {
        currentStreak: 0,
        longestStreak: 0,
        streakShields: 1,
      };
    }

    res.status(200).json({
      success: true,
      data: streak,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly goal
// @route   GET /api/gamification/weekly-goal
// @access  Private
export const getWeeklyGoal = async (req, res, next) => {
  try {
    let goal = await WeeklyGoal.findOne({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    if (!goal) {
      goal = {
        targetMinutes: 150,
        completedMinutes: 0,
      };
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set/Update weekly goal
// @route   POST /api/gamification/weekly-goal
// @access  Private
export const setWeeklyGoal = async (req, res, next) => {
  try {
    const { targetMinutes } = req.body;

    if (!targetMinutes || targetMinutes < 30) {
      return res.status(400).json({
        success: false,
        message: 'Target minutes must be at least 30 minutes per week.',
      });
    }

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    let goal = await WeeklyGoal.findOne({ user: req.user._id, weekStartDate: startOfWeek });

    if (goal) {
      goal.targetMinutes = targetMinutes;
      await goal.save();
    } else {
      goal = await WeeklyGoal.create({
        user: req.user._id,
        targetMinutes,
        completedMinutes: 0,
        weekStartDate: startOfWeek,
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get badges earned and available
// @route   GET /api/gamification/badges
// @access  Private
export const getBadges = async (req, res, next) => {
  try {
    const allBadges = await Badge.find().lean();
    const userBadges = await UserBadge.find({ user: req.user._id }).populate('badge').lean();

    const earnedBadgeIds = userBadges.map((ub) => ub.badge._id.toString());

    const result = allBadges.map((badge) => ({
      ...badge,
      isEarned: earnedBadgeIds.includes(badge._id.toString()),
    }));

    res.status(200).json({
      success: true,
      earnedCount: userBadges.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Leaderboard (Global + Cached 90s in Redis)
// @route   GET /api/gamification/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const cacheKey = 'leaderboard:global';

    // 1. Check Redis Cache
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
        return res.status(200).json(parsed);
      }
    }

    res.setHeader('X-Cache', 'MISS');

    // 2. Aggregate Top 10 Users by Total XP
    const leaderboard = await XP.aggregate([
      {
        $group: {
          _id: '$user',
          totalXP: { $sum: '$points' },
        },
      },
      { $sort: { totalXP: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          totalXP: 1,
          level: { $add: [{ $floor: { $sqrt: { $divide: ['$totalXP', 100] } } }, 1] },
          name: '$user.name',
          avatar: '$user.avatar',
        },
      },
    ]);

    const responsePayload = {
      success: true,
      data: leaderboard,
    };

    // 3. Cache result for 90 seconds
    if (redisClient && redisClient.isOpen) {
      const stringified = JSON.stringify(responsePayload);
      if (redisClient.setEx) {
        redisClient.setEx(cacheKey, 90, stringified).catch(() => {});
      } else if (redisClient.set) {
        redisClient.set(cacheKey, stringified, { ex: 90 }).catch(() => {});
      }
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};
