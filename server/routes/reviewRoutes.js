import express from 'express';
import {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validateReview } from '../middleware/validator.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/my-reviews', protect, getMyReviews);

router
  .route('/course/:courseId')
  .get(cacheMiddleware('course_reviews', 300), getCourseReviews)
  .post(protect, validateReview, createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
