import express from 'express';
import {
  getStreak,
  useShield,
  getWeeklyGoal,
  setWeeklyGoal,
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/streak', protect, getStreak);
router.post('/streak/use-shield', protect, useShield);
router.get('/weekly-goal', protect, getWeeklyGoal);
router.post('/weekly-goal', protect, setWeeklyGoal);

export default router;
