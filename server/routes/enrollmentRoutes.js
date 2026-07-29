import express from 'express';
import {
  getMyCourses,
  getCourseProgress,
  updateProgress,
  enrollInCourse,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my-courses', getMyCourses);
router.get('/course/:courseId', getCourseProgress);
router.put('/course/:courseId/progress', updateProgress);
router.post('/enroll/:courseId', enrollInCourse);

export default router;
