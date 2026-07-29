import mongoose from 'mongoose';

// XP Log Schema
const xpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true, // e.g. 'lecture_completed', 'quiz_passed', 'streak_bonus'
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

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

// Badge Schema
const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String,
    category: {
      type: String,
      enum: ['streak', 'completion', 'quiz', 'xp'],
      default: 'completion',
    },
    requiredValue: Number,
  },
  { timestamps: true }
);

// User Badge Schema
const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export const XP = mongoose.model('XP', xpSchema);
export const Streak = mongoose.model('Streak', streakSchema);
export const WeeklyGoal = mongoose.model('WeeklyGoal', weeklyGoalSchema);
export const Badge = mongoose.model('Badge', badgeSchema);
export const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

export default { XP, Streak, WeeklyGoal, Badge, UserBadge };
