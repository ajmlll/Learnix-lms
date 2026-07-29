import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  getMyCourses,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { upload } from '../middleware/upload.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { validateCourse } from '../middleware/validator.js';

const router = express.Router();

// Public course listing with 300s cache
router
  .route('/')
  .get(cacheMiddleware('courses_list', 300), getCourses)
  .post(protect, authorize('instructor', 'admin'), upload.single('thumbnail'), validateCourse, createCourse);

// Instructor own courses
router.get(
  '/my-courses',
  protect,
  authorize('instructor', 'admin'),
  getMyCourses
);

// Single course detail with 600s cache
router
  .route('/:id')
  .get(cacheMiddleware('course_detail', 600), getCourseById)
  .put(protect, authorize('instructor', 'admin'), upload.single('thumbnail'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

// Publish course
router.patch(
  '/:id/publish',
  protect,
  authorize('instructor', 'admin'),
  publishCourse
);

// Sections routes
router.post(
  '/:id/sections',
  protect,
  authorize('instructor', 'admin'),
  addSection
);

router
  .route('/:id/sections/:sectionId')
  .put(protect, authorize('instructor', 'admin'), updateSection)
  .delete(protect, authorize('instructor', 'admin'), deleteSection);

// Lectures routes
router.post(
  '/:id/sections/:sectionId/lectures',
  protect,
  authorize('instructor', 'admin'),
  upload.single('video'),
  addLecture
);

router
  .route('/:id/sections/:sectionId/lectures/:lectureId')
  .put(protect, authorize('instructor', 'admin'), upload.single('video'), updateLecture)
  .delete(protect, authorize('instructor', 'admin'), deleteLecture);

export default router;
