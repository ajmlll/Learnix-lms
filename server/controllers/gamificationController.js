import { Streak, WeeklyGoal } from '../models/Gamification.js';

// @desc    Get current user streak
// @route   GET /api/gamification/streak
// @access  Private
export const getStreak = async (req, res, next) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id }).lean();

    if (!streak) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      streak = {
        currentStreak: 1,
        longestStreak: 1,
        streakShields: 1,
        lastActiveDate: now,
        activeDates: [todayStr],
      };
    } else if (!streak.activeDates || streak.activeDates.length === 0) {
      // Backfill activeDates for existing streak records leading up to lastActiveDate
      const activeDates = [];
      const baseDate = streak.lastActiveDate ? new Date(streak.lastActiveDate) : new Date();
      const count = Math.max(1, streak.currentStreak || 1);
      for (let i = 0; i < count; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        activeDates.push(dStr);
      }
      streak.activeDates = activeDates;
    }

    res.status(200).json({
      success: true,
      data: streak,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Use a streak freeze shield to protect streak
// @route   POST /api/gamification/streak/use-shield
// @access  Private
export const useShield = async (req, res, next) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id });

    if (!streak) {
      streak = await Streak.create({
        user: req.user._id,
        currentStreak: 1,
        longestStreak: 1,
        streakShields: 1,
      });
    }

    if (streak.streakShields <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No streak shields available to activate.',
      });
    }

    streak.streakShields -= 1;
    await streak.save();

    res.status(200).json({
      success: true,
      message: 'Streak Freeze Shield activated successfully for 24 hours.',
      data: streak,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly goal & history from database
// @route   GET /api/gamification/weekly-goal
// @access  Private
export const getWeeklyGoal = async (req, res, next) => {
  try {
    const history = await WeeklyGoal.find({ user: req.user._id })
      .sort({ weekStartDate: -1 })
      .lean();

    let goal = history[0];

    if (!goal) {
      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      goal = {
        targetMinutes: 150,
        completedMinutes: 0,
        weekStartDate: startOfWeek,
      };
    }

    res.status(200).json({
      success: true,
      data: goal,
      history: history.length > 0 ? history : [goal],
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
