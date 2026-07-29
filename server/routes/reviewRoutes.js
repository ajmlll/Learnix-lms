import express from 'express';
import {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/course/:courseId')
  .get(getCourseReviews)
  .post(protect, createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
