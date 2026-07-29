import express from 'express';
import {
  getDashboardStats,
  getPendingCourses,
  getAllCourses,
  approveCourse,
  rejectCourse,
  getAllUsers,
  promoteUser,
  suspendUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Apply auth + admin role protection to ALL admin routes
router.use(protect, authorize('admin'));

router.get('/stats', cacheMiddleware('admin_stats', 300), getDashboardStats);
router.get('/pending-courses', getPendingCourses);
router.get('/courses', getAllCourses);
router.patch('/courses/:id/approve', approveCourse);
router.patch('/courses/:id/reject', rejectCourse);
router.get('/users', getAllUsers);
router.patch('/users/:id/promote', promoteUser);
router.patch('/users/:id/suspend', suspendUser);

export default router;
