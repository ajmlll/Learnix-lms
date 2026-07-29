import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { invalidateCourseCache } from '../utils/cacheInvalidation.js';

/**
 * Helper to recalculate course average rating and total rating count
 */
const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingsCount: stats[0].ratingsCount,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      ratingsCount: 0,
    });
  }

  await invalidateCourseCache(courseId);
};

// @desc    Create a course review
// @route   POST /api/reviews/course/:courseId
// @access  Private (Enrolled Student)
export const createReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Verify student is enrolled in course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Only enrolled students can review this course.',
      });
    }

    // Enforce 1 review per student per course
    const existingReview = await Review.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course. Please update your existing review.',
      });
    }

    const review = await Review.create({
      student: req.user._id,
      course: courseId,
      rating,
      comment: comment || '',
    });

    // Recalculate rating & invalidate cache
    await updateCourseRating(courseId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course (Public & Paginated)
// @route   GET /api/reviews/course/:courseId
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ course: courseId });

    const reviews = await Review.find({ course: courseId })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Review Owner)
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    if (review.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review.',
      });
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    await updateCourseRating(review.course);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review Owner / Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    const courseId = review.course;
    await review.deleteOne();

    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
