import Course from '../models/Course.js';
import Category from '../models/Category.js';
import { invalidateCourseCache } from '../utils/cacheInvalidation.js';

// TODO: When reviewController is created in a later step, call invalidateCourseCache(courseId) in review creation/updates

const slugify = (text) => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-') +
    '-' +
    Math.random().toString(36).substring(2, 7)
  );
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price, discountPrice, level, thumbnail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category.',
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Specified category not found.',
      });
    }

    const slug = slugify(title);

    const rawLevel = (level || 'beginner').toString().toLowerCase();
    const normalizedLevel = rawLevel.includes('all') ? 'all' : (['beginner', 'intermediate', 'advanced'].includes(rawLevel) ? rawLevel : 'beginner');
    const courseStatus = req.body.status && ['draft', 'pending', 'published'].includes(req.body.status) ? req.body.status : 'pending';

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      price: price || 0,
      discountPrice: discountPrice || 0,
      level: normalizedLevel,
      thumbnail: thumbnail || (req.file ? req.file.path : ''),
      instructor: req.user._id,
      status: courseStatus,
      isPublished: courseStatus === 'published',
    });

    await invalidateCourseCache(course._id);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public courses listing (Search, Filter, Paginate)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const skip = (page - 1) * limit;

    const query = { isPublished: true };

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.level) {
      query.level = req.query.level;
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      query.price = {};
      if (req.query.minPrice !== undefined) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice !== undefined) query.price.$lte = Number(req.query.maxPrice);
    }

    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .select('-sections')
      .populate('instructor', 'name avatar bio')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
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

// @desc    Get single course full detail (with sections & lectures)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('category', 'name slug')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course basic details
// @route   PUT /api/courses/:id
// @access  Private (Instructor owner/Admin)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course.',
      });
    }

    if (req.file) {
      req.body.thumbnail = req.file.path;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor owner/Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course.',
      });
    }

    await course.deleteOne();
    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish course / Request publication
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor/Admin)
export const publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course.',
      });
    }

    if (req.user.role === 'admin') {
      course.status = 'published';
      course.isPublished = true;
    } else {
      course.status = 'pending';
      course.isPublished = false;
    }

    await course.save();
    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: req.user.role === 'admin' ? 'Course published.' : 'Course submitted for admin review.',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get instructor's own created courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor/Admin)
export const getMyCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const skip = (page - 1) * limit;

    const query = { instructor: req.user._id };

    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .select('-sections')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
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

// ==========================================
// EMBEDDED SECTIONS CONTROLLERS
// ==========================================

export const addSection = async (req, res, next) => {
  try {
    const { title, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a section title.',
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const newSection = {
      title,
      order: order !== undefined ? order : course.sections.length,
      lectures: [],
    };

    course.sections.push(newSection);
    await course.save();

    await invalidateCourseCache(req.params.id);

    res.status(201).json({
      success: true,
      data: course.sections,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { title, order } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    if (title) section.title = title;
    if (order !== undefined) section.order = order;

    await course.save();
    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    section.deleteOne();
    await course.save();

    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Section removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EMBEDDED LECTURES CONTROLLERS
// ==========================================

export const addLecture = async (req, res, next) => {
  try {
    const { title, duration, order, isPreview, videoUrl } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a lecture title.',
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    let finalVideoUrl = videoUrl || '';
    if (req.file) {
      if (req.file.path.startsWith('http://') || req.file.path.startsWith('https://')) {
        finalVideoUrl = req.file.path;
      } else {
        const norm = req.file.path.replace(/\\/g, '/');
        finalVideoUrl = norm.startsWith('/') ? norm : `/${norm}`;
      }
    }

    const newLecture = {
      title,
      videoUrl: finalVideoUrl,
      duration: duration || 0,
      order: order !== undefined ? order : section.lectures.length,
      isPreview: isPreview === 'true' || isPreview === true,
      resources: [],
    };

    section.lectures.push(newLecture);
    await course.save();

    await invalidateCourseCache(req.params.id);

    res.status(201).json({
      success: true,
      data: section.lectures,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLecture = async (req, res, next) => {
  try {
    const { title, duration, order, isPreview, videoUrl } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    const lecture = section.lectures.id(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found.',
      });
    }

    if (title) lecture.title = title;
    if (duration !== undefined) lecture.duration = duration;
    if (order !== undefined) lecture.order = order;
    if (isPreview !== undefined) lecture.isPreview = isPreview === 'true' || isPreview === true;
    if (req.file) {
      if (req.file.path.startsWith('http://') || req.file.path.startsWith('https://')) {
        lecture.videoUrl = req.file.path;
      } else {
        const norm = req.file.path.replace(/\\/g, '/');
        lecture.videoUrl = norm.startsWith('/') ? norm : `/${norm}`;
      }
    } else if (videoUrl !== undefined) {
      lecture.videoUrl = videoUrl;
    }

    await course.save();
    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course.',
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    const lecture = section.lectures.id(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found.',
      });
    }

    lecture.deleteOne();
    await course.save();

    await invalidateCourseCache(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lecture removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
