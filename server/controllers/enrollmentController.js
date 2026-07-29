import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { awardXP, updateStreak } from '../utils/gamificationService.js';
import { generateCertificateInternal } from './certificateController.js';

/**
 * Internal Helper: Create an enrollment record after payment success
 */
export const createEnrollmentInternal = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  // Extract all lecture IDs across sections to initialize progress tracking
  const initialProgress = [];
  if (course.sections && course.sections.length > 0) {
    course.sections.forEach((section) => {
      if (section.lectures && section.lectures.length > 0) {
        section.lectures.forEach((lecture) => {
          initialProgress.push({
            lectureId: lecture._id,
            completed: false,
          });
        });
      }
    });
  }

  let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

  if (!enrollment) {
    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: initialProgress,
      progressPercent: 0,
      enrolledAt: new Date(),
    });
  }

  // Add course to user's enrolledCourses array
  await User.findByIdAndUpdate(studentId, {
    $addToSet: { enrolledCourses: courseId },
  });

  return enrollment;
};

// @desc    Get enrolled courses for logged-in student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title slug thumbnail price discountPrice level averageRating ratingsCount instructor category',
        populate: [
          { path: 'instructor', select: 'name avatar' },
          { path: 'category', select: 'name slug' },
        ],
      })
      .sort({ enrolledAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress details for a specific course
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Student)
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    }).lean();

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course.',
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress (mark lecture completed)
// @route   PUT /api/enrollments/course/:courseId/progress
// @access  Private (Student)
export const updateProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lectureId, completed } = req.body;

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a lectureId.',
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course.',
      });
    }

    const progressItem = enrollment.progress.find(
      (item) => item.lectureId.toString() === lectureId.toString()
    );

    const isCompleted = completed !== undefined ? Boolean(completed) : true;
    const isNewlyCompleted = isCompleted && (!progressItem || !progressItem.completed);

    if (progressItem) {
      progressItem.completed = isCompleted;
      progressItem.completedAt = isCompleted ? new Date() : undefined;
    } else {
      enrollment.progress.push({
        lectureId,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      });
    }

    // Recalculate progress percentage
    const totalLectures = enrollment.progress.length;
    const completedCount = enrollment.progress.filter((item) => item.completed).length;

    enrollment.progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    // Trigger Gamification XP & Streak updates on completion
    if (isNewlyCompleted) {
      await awardXP(req.user._id, 'lecture_completed', 50);
      await updateStreak(req.user._id);
    }

    // Handle course completion & PDF Certificate generation
    if (enrollment.progressPercent === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      enrollment.certificateIssued = true;

      try {
        await generateCertificateInternal(enrollment._id);
      } catch (certErr) {
        console.error('[Certificate Generation Error]:', certErr.message);
      }
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lecture progress updated.',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Directly enroll in a course (for free courses or checkout)
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private (Student)
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollment = await createEnrollmentInternal(req.user._id, courseId);
    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course!',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};
