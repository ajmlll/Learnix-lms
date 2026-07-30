import mongoose from 'mongoose';

// User Streak Schema
const streakSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    streakShields: {
      type: Number,
      default: 1, // Allow 1 free missed day shield
    },
    activeDates: {
      type: [String], // Format 'YYYY-MM-DD'
      default: [],
    },
  },
  { timestamps: true }
);

// Weekly Goal Schema
const weeklyGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetMinutes: {
      type: Number,
      default: 150, // 150 mins/week default
    },
    completedMinutes: {
      type: Number,
      default: 0,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Streak = mongoose.model('Streak', streakSchema);
export const WeeklyGoal = mongoose.model('WeeklyGoal', weeklyGoalSchema);

export default { Streak, WeeklyGoal };
