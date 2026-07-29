import express from 'express';
import {
  getXP,
  getStreak,
  getWeeklyGoal,
  setWeeklyGoal,
  getBadges,
  getLeaderboard,
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Public leaderboard route (cached 90s in Redis)
router.get('/leaderboard', cacheMiddleware('leaderboard', 90), getLeaderboard);

// Protected routes
router.get('/xp', protect, getXP);
router.get('/streak', protect, getStreak);
router.get('/weekly-goal', protect, getWeeklyGoal);
router.post('/weekly-goal', protect, setWeeklyGoal);
router.get('/badges', protect, getBadges);

export default router;
