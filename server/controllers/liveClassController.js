import LiveClass from '../models/LiveClass.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { invalidateLiveClassCache } from '../utils/cacheInvalidation.js';
import { createNotification } from '../utils/createNotification.js';

// @desc    Schedule a Live Class
// @route   POST /api/live-classes
// @access  Private (Instructor/Admin)
export const scheduleLiveClass = async (req, res, next) => {
  try {
    const { courseId, title, description, scheduledAt, durationMinutes } = req.body;

    if (!courseId || !title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, title, and scheduledAt date.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule live class for this course.',
      });
    }

    // Generate unique Jitsi room name and meeting URL
    const jitsiRoomName = `learnix-room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const jitsiMeetingUrl = `https://meet.jit.si/${jitsiRoomName}`;

    const liveClass = await LiveClass.create({
      course: courseId,
      instructor: req.user._id,
      title,
      description: description || '',
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 60,
      jitsiRoomName,
      jitsiMeetingUrl,
      status: 'scheduled',
    });

    await invalidateLiveClassCache(courseId);

    // Notify all enrolled students
    try {
      const enrollments = await Enrollment.find({ course: courseId }).select('student').lean();
      for (const env of enrollments) {
        await createNotification(
          env.student,
          'live_class_reminder',
          'Live Masterclass Scheduled',
          `New Live Class "${title}" scheduled for ${new Date(scheduledAt).toLocaleString()}`,
          `/student/live-classes`
        );
      }
    } catch (notifErr) {
      console.error('[Live Class Notification Error]:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming/live classes for a course
// @route   GET /api/live-classes/course/:courseId
// @access  Public / Enrolled
export const getLiveClassesByCourse = async (req, res, next) => {
  try {
    const liveClasses = await LiveClass.find({ course: req.params.courseId })
      .populate('instructor', 'name avatar')
      .sort({ scheduledAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: liveClasses.length,
      data: liveClasses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a Live Class (Record participant join)
// @route   POST /api/live-classes/:id/join
// @access  Private
export const joinLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class session not found.',
      });
    }

    // Record participant
    const existingParticipant = liveClass.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (!existingParticipant) {
      liveClass.participants.push({
        user: req.user._id,
        joinedAt: new Date(),
      });
      await liveClass.save();
    }

    res.status(200).json({
      success: true,
      jitsiMeetingUrl: liveClass.jitsiMeetingUrl,
      jitsiRoomName: liveClass.jitsiRoomName,
      data: liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Live Class status or details
// @route   PUT /api/live-classes/:id
// @access  Private (Instructor/Admin)
export const updateLiveClass = async (req, res, next) => {
  try {
    let liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class session not found.',
      });
    }

    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this live class.',
      });
    }

    liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await invalidateLiveClassCache(liveClass.course);

    res.status(200).json({
      success: true,
      data: liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Live Class session
// @route   DELETE /api/live-classes/:id
// @access  Private (Instructor/Admin)
export const deleteLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class session not found.',
      });
    }

    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this live class.',
      });
    }

    const courseId = liveClass.course;
    await liveClass.deleteOne();
    await invalidateLiveClassCache(courseId);

    res.status(200).json({
      success: true,
      message: 'Live class session deleted.',
    });
  } catch (error) {
    next(error);
  }
};
