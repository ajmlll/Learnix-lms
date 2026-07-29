import User from '../models/User.js';
import Course from '../models/Course.js';
import { invalidateCourseCache } from '../utils/cacheInvalidation.js';
import redisClient from '../config/redis.js';

// @desc    Get Admin Dashboard Stats (Single Aggregation Pipeline with $facet + Redis 300s Cache)
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
export const getDashboardStats = async (req, res, next) => {
  try {
    const cacheKey = 'admin:dashboard_stats';

    // 1. Check Redis Cache
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
        return res.status(200).json(parsed);
      }
    }

    res.setHeader('X-Cache', 'MISS');

    // 2. Single DB Round Trip $facet Aggregation Pipeline
    const statsFacet = await User.aggregate([
      { $limit: 1 }, // Ensure a base document exists for root pipeline
      {
        $facet: {
          totalUsers: [
            {
              $lookup: {
                from: 'users',
                pipeline: [{ $count: 'count' }],
                as: 'u',
              },
            },
            { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } },
            { $project: { count: { $ifNull: ['$u.count', 0] } } },
          ],
          totalCourses: [
            {
              $lookup: {
                from: 'courses',
                pipeline: [{ $count: 'count' }],
                as: 'c',
              },
            },
            { $unwind: { path: '$c', preserveNullAndEmptyArrays: true } },
            { $project: { count: { $ifNull: ['$c.count', 0] } } },
          ],
          totalRevenue: [
            {
              $lookup: {
                from: 'payments',
                pipeline: [
                  { $match: { status: 'success' } },
                  { $group: { _id: null, total: { $sum: '$amount' } } },
                ],
                as: 'p',
              },
            },
            { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } },
            { $project: { total: { $ifNull: ['$p.total', 0] } } },
          ],
          activeEnrollments: [
            {
              $lookup: {
                from: 'enrollments',
                pipeline: [{ $count: 'count' }],
                as: 'e',
              },
            },
            { $unwind: { path: '$e', preserveNullAndEmptyArrays: true } },
            { $project: { count: { $ifNull: ['$e.count', 0] } } },
          ],
        },
      },
    ]);

    const totalUsers = statsFacet[0]?.totalUsers[0]?.count || 0;
    const totalCourses = statsFacet[0]?.totalCourses[0]?.count || 0;
    const totalRevenue = statsFacet[0]?.totalRevenue[0]?.total || 0;
    const activeEnrollments = statsFacet[0]?.activeEnrollments[0]?.count || 0;

    const responsePayload = {
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        activeEnrollments,
      },
    };

    // 3. Cache response in Redis for 300 seconds (5 minutes)
    if (redisClient && redisClient.isOpen) {
      const stringified = JSON.stringify(responsePayload);
      if (redisClient.setEx) {
        redisClient.setEx(cacheKey, 300, stringified).catch(() => {});
      } else if (redisClient.set) {
        redisClient.set(cacheKey, stringified, { ex: 300 }).catch(() => {});
      }
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses pending approval
// @route   GET /api/admin/pending-courses
// @access  Private (Admin Only)
export const getPendingCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const query = { status: 'pending' };

    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses (Admin Catalog View)
// @route   GET /api/admin/courses
// @access  Private (Admin Only)
export const getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a pending course
// @route   PATCH /api/admin/courses/:id/approve
// @access  Private (Admin Only)
export const approveCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    course.status = 'published';
    course.isPublished = true;
    course.reviewNotes = '';

    await course.save();

    // Invalidate course cache
    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course approved and published successfully.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending course with feedback notes
// @route   PATCH /api/admin/courses/:id/reject
// @access  Private (Admin Only)
export const rejectCourse = async (req, res, next) => {
  try {
    const { reviewNotes } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    course.status = 'draft';
    course.isPublished = false;
    course.reviewNotes = reviewNotes || 'Course rejected during curriculum review.';

    await course.save();

    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course rejected and returned to draft.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Paginated & Filterable)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote user role
// @route   PATCH /api/admin/users/:id/promote
// @access  Private (Admin Only)
export const promoteUser = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid role: 'student', 'instructor', or 'admin'.",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = role;
    if (role === 'instructor') {
      user.isVerifiedInstructor = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin Only)
export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = 'student'; // Downgrade privileges
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account suspended.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
